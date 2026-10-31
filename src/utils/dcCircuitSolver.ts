import { CircuitElement, CircuitWire, SimulationResult, ComponentSimulationData } from '../types/dcLab';

// Gaussian elimination with partial pivoting for solving Ax = B
function solveLinearSystem(A: number[][], B: number[]): number[] | null {
  const n = B.length;
  if (n === 0) return [];

  // Deep copy A and B
  const a = A.map(row => [...row]);
  const b = [...B];

  for (let p = 0; p < n; p++) {
    // Find pivot row
    let max = Math.abs(a[p][p]);
    let maxRow = p;
    for (let i = p + 1; i < n; i++) {
      if (Math.abs(a[i][p]) > max) {
        max = Math.abs(a[i][p]);
        maxRow = i;
      }
    }

    if (max < 1e-12) {
      // Singular or ill-conditioned matrix
      return null;
    }

    // Swap pivot row
    const tempA = a[p];
    a[p] = a[maxRow];
    a[maxRow] = tempA;

    const tempB = b[p];
    b[p] = b[maxRow];
    b[maxRow] = tempB;

    // Eliminate below
    for (let i = p + 1; i < n; i++) {
      const alpha = a[i][p] / a[p][p];
      b[i] -= alpha * b[p];
      for (let j = p; j < n; j++) {
        a[i][j] -= alpha * a[p][j];
      }
    }
  }

  // Back substitution
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += a[i][j] * x[j];
    }
    if (Math.abs(a[i][i]) < 1e-12) return null;
    x[i] = (b[i] - sum) / a[i][i];
  }

  return x;
}

export class DcCircuitSolver {
  /**
   * Solves the given circuit components and wires using Modified Nodal Analysis (MNA).
   */
  public static solve(components: CircuitElement[], wires: CircuitWire[]): SimulationResult {
    const timestamp = Date.now();
    const elementData: Record<string, ComponentSimulationData> = {};
    const diagnosticMessages: SimulationResult['diagnosticMessages'] = [];

    if (components.length === 0) {
      return {
        timestamp,
        nodeVoltages: {},
        elementData: {},
        totalPowerSupplied: 0,
        totalPowerDissipated: 0,
        hasGround: false,
        isShortCircuit: false,
        isOpenCircuit: true,
        kclErrors: [],
        diagnosticMessages: [{
          type: 'info',
          messageAr: 'لوحة التجارب فارغة. أضف مصدراً للجهد ومقاومات لتبدأ المحاكاة.',
          messageEn: 'The breadboard is empty. Add a DC source and resistors to begin.'
        }]
      };
    }

    // 1. Group connected terminals into unified electrical Nodes using Disjoint-Set (Union-Find)
    const terminalKey = (compId: string, termId: string) => `${compId}:${termId}`;
    const parent: Record<string, string> = {};

    function find(i: string): string {
      if (!parent[i]) parent[i] = i;
      if (parent[i] === i) return i;
      parent[i] = find(parent[i]);
      return parent[i];
    }

    function union(i: string, j: string) {
      const rootI = find(i);
      const rootJ = find(j);
      if (rootI !== rootJ) {
        parent[rootI] = rootJ;
      }
    }

    // Initialize all component terminals
    for (const comp of components) {
      for (const term of comp.terminals) {
        const k = terminalKey(comp.id, term.id);
        parent[k] = k;
      }
    }

    // Connect terminals joined by wires
    for (const wire of wires) {
      const kFrom = terminalKey(wire.fromComponentId, wire.fromTerminalId);
      const kTo = terminalKey(wire.toComponentId, wire.toTerminalId);
      union(kFrom, kTo);
    }

    // Group terminals by breadboard internal conductive tie-strips if set
    const breadboardStrips: Record<string, string[]> = {};
    for (const comp of components) {
      for (const term of comp.terminals) {
        if (term.breadboardHoleId) {
          // Identify strip ID: e.g. row_12_top (A-B-C-D-E), row_12_bot (F-G-H-I-J), rail_top_plus, rail_top_minus
          let stripId = term.breadboardHoleId;
          const match = term.breadboardHoleId.match(/row_(\d+)_([A-E|F-J])/);
          if (match) {
            const rowNum = match[1];
            const colLetter = match[2];
            const half = ['A', 'B', 'C', 'D', 'E'].includes(colLetter) ? 'top' : 'bot';
            stripId = `strip_row_${rowNum}_${half}`;
          }
          if (!breadboardStrips[stripId]) breadboardStrips[stripId] = [];
          breadboardStrips[stripId].push(terminalKey(comp.id, term.id));
        }
      }
    }

    // Electrically union all terminals inserted into the same breadboard strip
    Object.values(breadboardStrips).forEach((termKeys) => {
      for (let i = 1; i < termKeys.length; i++) {
        union(termKeys[0], termKeys[i]);
      }
    });

    // Handle closed switches and pressed pushbuttons
    for (const comp of components) {
      if ((comp.type === 'switch' || comp.type === 'pushbutton') && !comp.isOpen && comp.terminals.length >= 2) {
        union(terminalKey(comp.id, comp.terminals[0].id), terminalKey(comp.id, comp.terminals[1].id));
      }
    }

    // Map each terminal to its assigned Node ID
    const terminalNodeMap: Record<string, string> = {};
    const uniqueNodesSet = new Set<string>();

    for (const comp of components) {
      for (const term of comp.terminals) {
        const k = terminalKey(comp.id, term.id);
        const root = find(k);
        terminalNodeMap[k] = root;
        uniqueNodesSet.add(root);
      }
    }

    // 2. Identify Ground Node (0V reference)
    let groundNodeId: string | null = null;
    const gndComp = components.find(c => c.type === 'ground');
    if (gndComp && gndComp.terminals[0]) {
      groundNodeId = find(terminalKey(gndComp.id, gndComp.terminals[0].id));
    }

    // If no explicit ground, find primary DC source or battery negative terminal (t2 / -)
    const dcSource = components.find(c => c.type === 'dc_source' || c.type === 'battery');
    if (!groundNodeId && dcSource && dcSource.terminals.length >= 2) {
      groundNodeId = find(terminalKey(dcSource.id, dcSource.terminals[1].id));
      diagnosticMessages.push({
        type: 'info',
        messageAr: 'تم تعيين الطرف السالب لمصدر الجهد كمرجع تأريض (0V Ground) تلقائياً.',
        messageEn: 'Negative terminal of the DC source was set as reference 0V ground automatically.'
      });
    }

    // If still no ground, pick any node as 0V reference
    if (!groundNodeId && uniqueNodesSet.size > 0) {
      groundNodeId = Array.from(uniqueNodesSet)[0];
    }

    // Check if DC source is shorted directly (pos and neg connected to same node)
    let isShortCircuit = false;
    let isOpenCircuit = false;

    if (dcSource && dcSource.terminals.length >= 2) {
      const posNode = terminalNodeMap[terminalKey(dcSource.id, dcSource.terminals[0].id)];
      const negNode = terminalNodeMap[terminalKey(dcSource.id, dcSource.terminals[1].id)];
      if (posNode === negNode) {
        isShortCircuit = true;
        diagnosticMessages.push({
          type: 'error',
          messageAr: 'تحذير خطر: دائرة قصر (Short Circuit) مباشرة عبر طرفي مصدر الجهد! افصل السلك المسبب فوراً.',
          messageEn: 'Danger Warning: Direct Short Circuit across DC source terminals! Disconnect immediately.',
          componentId: dcSource.id
        });
      }
    }

    // 3. Setup MNA (Modified Nodal Analysis)
    // Non-ground nodes:
    const nonGndNodes = Array.from(uniqueNodesSet).filter(n => n !== groundNodeId);
    const nodeIndexMap: Record<string, number> = {};
    nonGndNodes.forEach((n, idx) => { nodeIndexMap[n] = idx; });
    const numNonGndNodes = nonGndNodes.length;

    // Count independent voltage sources (dc_source, battery)
    const voltageSources: CircuitElement[] = [];
    for (const comp of components) {
      if (comp.type === 'dc_source' || comp.type === 'battery') {
        voltageSources.push(comp);
      }
    }
    const numVoltageSources = voltageSources.length;

    const matrixSize = numNonGndNodes + numVoltageSources;
    if (matrixSize === 0 || isShortCircuit) {
      // Fallback or shorted
      const emptyRes: SimulationResult = {
        timestamp,
        nodeVoltages: groundNodeId ? { [groundNodeId]: 0 } : {},
        elementData: {},
        totalPowerSupplied: 0,
        totalPowerDissipated: 0,
        hasGround: !!gndComp,
        isShortCircuit,
        isOpenCircuit: true,
        kclErrors: [],
        diagnosticMessages
      };
      return emptyRes;
    }

    const A: number[][] = Array.from({ length: matrixSize }, () => new Array(matrixSize).fill(0));
    const B: number[] = new Array(matrixSize).fill(0);

    // Helper to add conductance G between two nodes n1 and n2
    const addConductance = (node1: string, node2: string, G: number) => {
      const i = node1 !== groundNodeId ? nodeIndexMap[node1] : -1;
      const j = node2 !== groundNodeId ? nodeIndexMap[node2] : -1;

      if (i >= 0) A[i][i] += G;
      if (j >= 0) A[j][j] += G;
      if (i >= 0 && j >= 0) {
        A[i][j] -= G;
        A[j][i] -= G;
      }
    };

    // Fill Passive Conductances (Resistors, Potentiometers, Rheostats, LEDs, Closed Switches, Meters)
    for (const comp of components) {
      if (comp.terminals.length < 2) continue;
      const nodeA = terminalNodeMap[terminalKey(comp.id, comp.terminals[0].id)];
      const nodeB = terminalNodeMap[terminalKey(comp.id, comp.terminals[1].id)];

      if (comp.type === 'resistor') {
        const R = Math.max(0.001, comp.value || 1000);
        addConductance(nodeA, nodeB, 1 / R);
      } else if (comp.type === 'potentiometer' || comp.type === 'rheostat') {
        // Potentiometer: R_total, wiper splits into R1 and R2
        const totalR = Math.max(1, comp.value || 10000);
        const percent = Math.min(100, Math.max(0, comp.wiperPercent ?? 50)) / 100;
        const R1 = Math.max(0.1, totalR * percent);
        const R2 = Math.max(0.1, totalR * (1 - percent));

        if (comp.terminals.length >= 3) {
          // Terminal 0: High, Terminal 1: Low, Terminal 2: Wiper
          const nodeWiper = terminalNodeMap[terminalKey(comp.id, comp.terminals[2].id)];
          addConductance(nodeA, nodeWiper, 1 / R1);
          addConductance(nodeB, nodeWiper, 1 / R2);
        } else {
          // Rheostat (2 terminals)
          addConductance(nodeA, nodeB, 1 / R1);
        }
      } else if (comp.type === 'diode') {
        // Piecewise diode model: threshold 0.7V, dynamic forward resistance ~5Ω, reverse ~100MΩ
        const forwardDrop = comp.forwardDrop ?? 0.7;
        addConductance(nodeA, nodeB, 1 / 15);
      } else if (comp.type === 'led') {
        // Piecewise LED model: dynamic forward resistance ~30Ω
        addConductance(nodeA, nodeB, 1 / 40);
      } else if (comp.type === 'bulb') {
        // Incandescent lamp filament resistance ~24Ω
        addConductance(nodeA, nodeB, 1 / 24);
      } else if (comp.type === 'buzzer') {
        // Piezo buzzer ~80Ω
        addConductance(nodeA, nodeB, 1 / 80);
      } else if (comp.type === 'dc_motor') {
        // Small DC motor armature resistance ~12Ω
        addConductance(nodeA, nodeB, 1 / 12);
      } else if (comp.type === 'relay') {
        // Coil terminals (0 & 1): ~100Ω
        addConductance(nodeA, nodeB, 1 / 100);
        // Switch contacts (2 & 3: COM & NO): closed if energized
        if (comp.terminals.length >= 4) {
          const nodeCom = terminalNodeMap[terminalKey(comp.id, comp.terminals[2].id)];
          const nodeNO = terminalNodeMap[terminalKey(comp.id, comp.terminals[3].id)];
          if (comp.isEnergized) {
            addConductance(nodeCom, nodeNO, 1000); // 0.001Ω
          }
        }
      } else if (comp.type === 'npn_bjt' && comp.terminals.length >= 3) {
        // Terminal 0: Base, Terminal 1: Collector, Terminal 2: Emitter
        const nodeBase = terminalNodeMap[terminalKey(comp.id, comp.terminals[0].id)];
        const nodeColl = terminalNodeMap[terminalKey(comp.id, comp.terminals[1].id)];
        const nodeEmit = terminalNodeMap[terminalKey(comp.id, comp.terminals[2].id)];
        // Base-Emitter forward junction ~50Ω
        addConductance(nodeBase, nodeEmit, 1 / 50);
        // Collector-Emitter controlled channel ~10Ω
        addConductance(nodeColl, nodeEmit, 1 / 15);
      } else if (comp.type === 'pnp_bjt' && comp.terminals.length >= 3) {
        const nodeBase = terminalNodeMap[terminalKey(comp.id, comp.terminals[0].id)];
        const nodeColl = terminalNodeMap[terminalKey(comp.id, comp.terminals[1].id)];
        const nodeEmit = terminalNodeMap[terminalKey(comp.id, comp.terminals[2].id)];
        addConductance(nodeEmit, nodeBase, 1 / 50);
        addConductance(nodeEmit, nodeColl, 1 / 15);
      } else if (comp.type === 'n_mosfet' && comp.terminals.length >= 3) {
        // Terminal 0: Gate, Terminal 1: Drain, Terminal 2: Source
        const nodeGate = terminalNodeMap[terminalKey(comp.id, comp.terminals[0].id)];
        const nodeDrain = terminalNodeMap[terminalKey(comp.id, comp.terminals[1].id)];
        const nodeSrc = terminalNodeMap[terminalKey(comp.id, comp.terminals[2].id)];
        // Gate is isolated 100MΩ
        addConductance(nodeGate, nodeSrc, 1e-8);
        // Drain-Source conduction channel ~2Ω
        addConductance(nodeDrain, nodeSrc, 1 / 2);
      } else if (comp.type === 'switch' || comp.type === 'pushbutton') {
        if (comp.isOpen) {
          // Open switch: 100 Megaohms (virtually open)
          addConductance(nodeA, nodeB, 1e-8);
        } else {
          // Closed switch: 0.0001 ohms
          addConductance(nodeA, nodeB, 10000);
        }
      } else if (comp.type === 'ammeter') {
        // Ideal ammeter shunt: 0.005 ohm
        addConductance(nodeA, nodeB, 200);
      } else if (comp.type === 'voltmeter' || comp.type === 'oscilloscope') {
        // Ideal meter input impedance: 10 Megaohms
        addConductance(nodeA, nodeB, 1e-7);
      } else if (comp.type === 'capacitor') {
        // In DC steady state, capacitor behaves as an open circuit (100 Megaohms)
        addConductance(nodeA, nodeB, 1e-8);
      } else if (comp.type === 'inductor') {
        // In DC steady state, inductor behaves as a short circuit with small coil resistance (0.05 ohm)
        addConductance(nodeA, nodeB, 20);
      }
    }

    // Fill Voltage Sources into MNA
    voltageSources.forEach((vs, k) => {
      const vIndex = numNonGndNodes + k;
      const posNode = terminalNodeMap[terminalKey(vs.id, vs.terminals[0].id)];
      const negNode = terminalNodeMap[terminalKey(vs.id, vs.terminals[1].id)];
      const Vval = vs.value || 10;

      const iPos = posNode !== groundNodeId ? nodeIndexMap[posNode] : -1;
      const iNeg = negNode !== groundNodeId ? nodeIndexMap[negNode] : -1;

      if (iPos >= 0) {
        A[iPos][vIndex] += 1;
        A[vIndex][iPos] += 1;
      }
      if (iNeg >= 0) {
        A[iNeg][vIndex] -= 1;
        A[vIndex][iNeg] -= 1;
      }

      B[vIndex] = Vval;
    });

    // 4. Solve the linear system
    const solution = solveLinearSystem(A, B);

    const nodeVoltages: Record<string, number> = {};
    if (groundNodeId) {
      nodeVoltages[groundNodeId] = 0;
    }

    if (solution) {
      nonGndNodes.forEach((nodeId, idx) => {
        nodeVoltages[nodeId] = solution[idx];
      });
    } else {
      diagnosticMessages.push({
        type: 'warning',
        messageAr: 'الدائرة تحتوي على عقد معلقة (Floating Nodes) أو تفرعات غير متصلة بالأرضي.',
        messageEn: 'The circuit has floating nodes or open branches disconnected from reference.'
      });
      isOpenCircuit = true;
    }

    // 5. Calculate per-component currents, voltages, and powers
    let totalSuppliedPower = 0;
    let totalDissipatedPower = 0;

    for (const comp of components) {
      if (comp.terminals.length < 2) continue;

      const t1Key = terminalKey(comp.id, comp.terminals[0].id);
      const t2Key = terminalKey(comp.id, comp.terminals[1].id);
      const n1 = terminalNodeMap[t1Key];
      const n2 = terminalNodeMap[t2Key];

      const v1 = nodeVoltages[n1] ?? 0;
      const v2 = nodeVoltages[n2] ?? 0;
      const vDrop = v1 - v2;

      let current = 0; // A
      let power = 0;   // W

      if (comp.type === 'resistor') {
        const R = Math.max(0.001, comp.value || 1000);
        current = vDrop / R;
        power = vDrop * current;
        totalDissipatedPower += power;
      } else if (comp.type === 'potentiometer' || comp.type === 'rheostat') {
        const totalR = Math.max(1, comp.value || 10000);
        const percent = Math.min(100, Math.max(0, comp.wiperPercent ?? 50)) / 100;
        const R1 = Math.max(0.1, totalR * percent);
        current = vDrop / R1;
        power = vDrop * current;
        totalDissipatedPower += power;
      } else if (comp.type === 'dc_source' || comp.type === 'battery') {
        // Look up source current from MNA solution
        const vsIdx = voltageSources.findIndex(vs => vs.id === comp.id);
        if (solution && vsIdx >= 0) {
          current = solution[numNonGndNodes + vsIdx]; // current out of positive terminal
          power = (comp.value || 10) * current;
          totalSuppliedPower += power;
        }
      } else if (comp.type === 'switch' || comp.type === 'pushbutton') {
        if (!comp.isOpen) {
          current = vDrop / 0.0001;
          power = 0;
        } else {
          current = 0;
          power = 0;
        }
      } else if (comp.type === 'ammeter') {
        current = vDrop / 0.005; // based on internal shunt
        power = vDrop * current;
      } else if (comp.type === 'voltmeter' || comp.type === 'oscilloscope') {
        current = vDrop / 1e7;
        power = 0;
      } else if (comp.type === 'capacitor') {
        // DC steady state
        current = 0;
        power = 0;
      } else if (comp.type === 'inductor') {
        // DC steady state
        current = vDrop / 0.05;
        power = vDrop * current;
      } else if (comp.type === 'diode') {
        const threshold = comp.forwardDrop ?? 0.7;
        if (vDrop > threshold) {
          current = (vDrop - threshold) / 10;
          power = vDrop * current;
          totalDissipatedPower += power;
        } else {
          current = 0;
          power = 0;
        }
      } else if (comp.type === 'led') {
        const threshold = comp.forwardDrop ?? 1.8;
        if (vDrop > threshold) {
          current = (vDrop - threshold) / 25;
          power = vDrop * current;
          totalDissipatedPower += power;
          comp.isGlowing = current > 0.001;
        } else {
          current = 0;
          power = 0;
          comp.isGlowing = false;
        }
      } else if (comp.type === 'bulb') {
        current = vDrop / 24;
        power = vDrop * current;
        totalDissipatedPower += power;
        comp.isGlowing = Math.abs(vDrop) > 2.5;
      } else if (comp.type === 'buzzer') {
        current = vDrop / 80;
        power = vDrop * current;
        totalDissipatedPower += power;
        comp.isBeeping = Math.abs(vDrop) > 2.0;
      } else if (comp.type === 'dc_motor') {
        current = vDrop / 12;
        power = vDrop * current;
        totalDissipatedPower += power;
        comp.motorRpm = Math.round(Math.abs(vDrop) * 280);
      } else if (comp.type === 'relay') {
        current = vDrop / 100;
        power = vDrop * current;
        totalDissipatedPower += power;
        comp.isEnergized = Math.abs(current) > 0.025; // 25mA pull-in
      } else if (comp.type === 'npn_bjt') {
        current = vDrop / 15;
        power = vDrop * current;
        totalDissipatedPower += power;
      } else if (comp.type === 'pnp_bjt') {
        current = vDrop / 15;
        power = vDrop * current;
        totalDissipatedPower += power;
      } else if (comp.type === 'n_mosfet') {
        current = vDrop / 2;
        power = vDrop * current;
        totalDissipatedPower += power;
      }

      // Check power rating burn out (e.g. 0.25W resistor exceeded)
      const maxPower = comp.maxPowerRating || 0.5; // 0.5W default for 1/2W resistors
      const isBurnedOut = (comp.type === 'resistor' || comp.type === 'potentiometer') && power > maxPower * 1.5;
      if (isBurnedOut) {
        diagnosticMessages.push({
          type: 'warning',
          messageAr: `تحذير: المقاومة (${comp.name}) تجاوزت قدرتها المقننة (${power.toFixed(2)}W > ${maxPower}W) وارتفعت حرارتها!`,
          messageEn: `Warning: Resistor (${comp.name}) exceeded its rated power limit!`,
          componentId: comp.id
        });
      }

      elementData[comp.id] = {
        voltageDrop: vDrop,
        current,
        power,
        node1Voltage: v1,
        node2Voltage: v2,
        isBurnedOut
      };
    }

    // 6. Verify Kirchhoff's Laws
    const kclErrors: string[] = [];
    if (solution) {
      nonGndNodes.forEach((nodeId) => {
        let netCurrent = 0;
        for (const comp of components) {
          if (comp.terminals.length < 2) continue;
          const ed = elementData[comp.id];
          if (!ed) continue;
          const n1 = terminalNodeMap[terminalKey(comp.id, comp.terminals[0].id)];
          const n2 = terminalNodeMap[terminalKey(comp.id, comp.terminals[1].id)];

          if (n1 === nodeId) {
            netCurrent -= ed.current; // leaves node
          } else if (n2 === nodeId) {
            netCurrent += ed.current; // enters node
          }
        }
        if (Math.abs(netCurrent) > 0.005) {
          kclErrors.push(`عقدة ${nodeId.slice(-4)}: مجموع التيارات = ${netCurrent.toFixed(4)}A`);
        }
      });
    }

    // Check circuit success feedback
    if (!isShortCircuit && dcSource && totalSuppliedPower > 0.0001) {
      diagnosticMessages.push({
        type: 'success',
        messageAr: `الدائرة تعمل بنجاح: القدرة المجهزة (${(totalSuppliedPower * 1000).toFixed(1)} mW) تتطابق مع القدرة المستهلكة (${(totalDissipatedPower * 1000).toFixed(1)} mW) وفق قانون حفظ الطاقة.`,
        messageEn: `Circuit active: Supplied power matches dissipated power perfectly.`
      });
    }

    // 7. Transient RC / RL curve computation for Experiment 15
    let transientCurve: SimulationResult['transientCurve'] | undefined = undefined;
    const capacitor = components.find(c => c.type === 'capacitor');
    const inductor = components.find(c => c.type === 'inductor');
    const primaryR = components.find(c => c.type === 'resistor');

    if (dcSource && capacitor && primaryR) {
      const R = primaryR.value || 1000;
      const C = capacitor.value || 100e-6; // 100uF
      const tau = R * C;
      const Vs = dcSource.value || 10;
      const timePoints: number[] = [];
      const voltages: number[] = [];
      const currents: number[] = [];

      const totalTime = 5 * tau; // 5 tau is full charge
      const steps = 60;
      for (let s = 0; s <= steps; s++) {
        const t = (s / steps) * totalTime;
        timePoints.push(t);
        const vc = Vs * (1 - Math.exp(-t / tau));
        const ic = (Vs / R) * Math.exp(-t / tau);
        voltages.push(vc);
        currents.push(ic);
      }

      transientCurve = {
        timePoints,
        voltages,
        currents,
        tau,
        type: 'rc_charge'
      };
    } else if (dcSource && inductor && primaryR) {
      const R = primaryR.value || 100;
      const L = inductor.value || 0.05; // 50mH
      const tau = L / R;
      const Vs = dcSource.value || 10;
      const timePoints: number[] = [];
      const voltages: number[] = [];
      const currents: number[] = [];

      const totalTime = 5 * tau;
      const steps = 60;
      for (let s = 0; s <= steps; s++) {
        const t = (s / steps) * totalTime;
        timePoints.push(t);
        const il = (Vs / R) * (1 - Math.exp(-t / tau));
        const vl = Vs * Math.exp(-t / tau);
        voltages.push(vl);
        currents.push(il);
      }

      transientCurve = {
        timePoints,
        voltages,
        currents,
        tau,
        type: 'rl_charge'
      };
    }

    return {
      timestamp,
      nodeVoltages,
      elementData,
      totalPowerSupplied: totalSuppliedPower,
      totalPowerDissipated: totalDissipatedPower,
      hasGround: !!gndComp,
      isShortCircuit,
      isOpenCircuit: isOpenCircuit || totalSuppliedPower < 1e-6,
      kclErrors,
      diagnosticMessages,
      transientCurve
    };
  }

  /**
   * Evaluates Thévenin Equivalent (Vth, Rth) between two terminals
   */
  public static calculateThevenin(
    components: CircuitElement[],
    wires: CircuitWire[],
    termACompId: string,
    termAId: string,
    termBCompId: string,
    termBId: string
  ): { vth: number; rth: number } {
    // 1. Solve open circuit voltage Voc = Vth
    const simOpen = this.solve(components, wires);
    const kA = `${termACompId}:${termAId}`;
    const kB = `${termBCompId}:${termBId}`;

    // Look up terminal voltages
    const vA = simOpen.nodeVoltages[kA] ?? 0;
    const vB = simOpen.nodeVoltages[kB] ?? 0;
    const vth = Math.abs(vA - vB);

    // 2. To find Rth: Connect a test 1k resistor between A and B, see voltage drop V_load
    const testR = 1000;
    // Rth = testR * (Vth / V_load - 1)
    const testComp: CircuitElement = {
      id: '__test_rth_probe__',
      type: 'resistor',
      name: 'R_test',
      value: testR,
      unit: 'Ω',
      x: 0,
      y: 0,
      rotation: 0,
      terminals: [
        { id: 't1', x: 0, y: 0 },
        { id: 't2', x: 0, y: 0 }
      ]
    };
    const testWire1: CircuitWire = {
      id: '__w1__',
      fromComponentId: termACompId,
      fromTerminalId: termAId,
      toComponentId: testComp.id,
      toTerminalId: 't1'
    };
    const testWire2: CircuitWire = {
      id: '__w2__',
      fromComponentId: termBCompId,
      fromTerminalId: termBId,
      toComponentId: testComp.id,
      toTerminalId: 't2'
    };

    const simLoaded = this.solve([...components, testComp], [...wires, testWire1, testWire2]);
    const vLoad = Math.abs(simLoaded.elementData[testComp.id]?.voltageDrop || 0);

    let rth = 100;
    if (vLoad > 1e-4 && vth > vLoad) {
      rth = testR * ((vth / vLoad) - 1);
    }

    return { vth, rth: Math.max(0.1, rth) };
  }
}
