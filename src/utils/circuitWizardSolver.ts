import { CwComponent, CwWire, CwSolverResult } from '../types/circuitWizard';

export class CircuitWizardSolver {
  /**
   * Main solver function for Circuit Wizard
   */
  public static solve(components: CwComponent[], wires: CwWire[]): CwSolverResult {
    const nodeVoltages: Record<string, number> = {};
    const branchCurrents: Record<string, number> = {};
    const logicStates: Record<string, '0' | '1' | 'X'> = {};
    const compStates: Record<string, any> = {};
    let hasShortCircuit = false;
    const warnings: string[] = [];

    // Map pins to node IDs
    const pinToNodeMap = new Map<string, string>();
    let nodeCounter = 1;

    // Find Ground component if any
    const gndComp = components.find((c) => c.type === 'ground');

    // Build connected net clusters
    wires.forEach((w) => {
      const pinAKey = `${w.fromCompId}_${w.fromPinId}`;
      const pinBKey = `${w.toCompId}_${w.toPinId}`;

      const nodeA = pinToNodeMap.get(pinAKey);
      const nodeB = pinToNodeMap.get(pinBKey);

      if (!nodeA && !nodeB) {
        const newNode = `net_${nodeCounter++}`;
        pinToNodeMap.set(pinAKey, newNode);
        pinToNodeMap.set(pinBKey, newNode);
      } else if (nodeA && !nodeB) {
        pinToNodeMap.set(pinBKey, nodeA);
      } else if (!nodeA && nodeB) {
        pinToNodeMap.set(pinAKey, nodeB);
      } else if (nodeA && nodeB && nodeA !== nodeB) {
        // Merge nodes
        const targetNode = nodeA;
        const sourceNode = nodeB;
        pinToNodeMap.forEach((val, key) => {
          if (val === sourceNode) {
            pinToNodeMap.set(key, targetNode);
          }
        });
      }
    });

    // Find Power Source voltage
    const pwrComp = components.find((c) => c.type === 'battery' || c.type === 'dc_supply');
    const pwrVoltage = pwrComp ? pwrComp.value : 9;

    // Assign node voltages
    if (pwrComp) {
      const posPinKey = `${pwrComp.id}_p1`;
      const negPinKey = `${pwrComp.id}_p2`;
      const posNode = pinToNodeMap.get(posPinKey);
      const negNode = pinToNodeMap.get(negPinKey);

      if (posNode) nodeVoltages[posNode] = pwrVoltage;
      if (negNode) nodeVoltages[negNode] = 0;
    }

    if (gndComp) {
      const gndPinKey = `${gndComp.id}_p1`;
      const gndNode = pinToNodeMap.get(gndPinKey);
      if (gndNode) nodeVoltages[gndNode] = 0;
    }

    // Solve component states
    components.forEach((comp) => {
      if (comp.type === 'battery' || comp.type === 'dc_supply') {
        compStates[comp.id] = { voltage: comp.value, current: 0.1 };
      } else if (comp.type === 'resistor') {
        const node1 = pinToNodeMap.get(`${comp.id}_p1`);
        const node2 = pinToNodeMap.get(`${comp.id}_p2`);
        const v1 = node1 && nodeVoltages[node1] !== undefined ? nodeVoltages[node1] : 0;
        const v2 = node2 && nodeVoltages[node2] !== undefined ? nodeVoltages[node2] : 0;
        const vDiff = Math.abs(v1 - v2);
        const R = (comp.value || 1) * (comp.unit === 'kΩ' ? 1000 : comp.unit === 'MΩ' ? 1000000 : 1);
        const current = R > 0 ? vDiff / R : 0;

        compStates[comp.id] = {
          voltage: vDiff,
          current,
          power: current * vDiff,
        };
      } else if (comp.type === 'led') {
        const nodeAnode = pinToNodeMap.get(`${comp.id}_p1`);
        const nodeCathode = pinToNodeMap.get(`${comp.id}_p2`);
        const vA = nodeAnode && nodeVoltages[nodeAnode] !== undefined ? nodeVoltages[nodeAnode] : 0;
        const vK = nodeCathode && nodeVoltages[nodeCathode] !== undefined ? nodeVoltages[nodeCathode] : 0;
        const isGlow = vA - vK >= 1.8;

        compStates[comp.id] = {
          voltage: Math.max(0, vA - vK),
          current: isGlow ? 0.015 : 0,
          isGlow,
        };

        if (nodeAnode && nodeVoltages[nodeAnode] === undefined && isGlow) {
          nodeVoltages[nodeAnode] = 2.0;
        }
      } else if (comp.type === 'switch') {
        const isOpen = comp.state?.isOpen ?? false;
        compStates[comp.id] = { isOpen };
      } else if (comp.type === 'ic_555') {
        // 555 Timer simulation
        const isOscillating = true;
        const freq = 1.44 / (1000 + 2 * 10000) / 0.00001; // ~14Hz
        compStates[comp.id] = { isOscillating, freq };

        const outPinKey = `${comp.id}_p3`;
        const outNode = pinToNodeMap.get(outPinKey);
        if (outNode) {
          // Toggle voltage simulation
          nodeVoltages[outNode] = Math.random() > 0.5 ? pwrVoltage : 0;
        }
      } else if (
        comp.type === 'and_gate' ||
        comp.type === 'or_gate' ||
        comp.type === 'nand_gate' ||
        comp.type === 'nor_gate' ||
        comp.type === 'xor_gate'
      ) {
        const nodeA = pinToNodeMap.get(`${comp.id}_p1`);
        const nodeB = pinToNodeMap.get(`${comp.id}_p2`);
        const nodeY = pinToNodeMap.get(`${comp.id}_p3`);

        const vA = nodeA && nodeVoltages[nodeA] !== undefined ? nodeVoltages[nodeA] : 0;
        const vB = nodeB && nodeVoltages[nodeB] !== undefined ? nodeVoltages[nodeB] : 0;

        const inA = vA >= 2.5;
        const inB = vB >= 2.5;
        let outY = false;

        if (comp.type === 'and_gate') outY = inA && inB;
        else if (comp.type === 'or_gate') outY = inA || inB;
        else if (comp.type === 'nand_gate') outY = !(inA && inB);
        else if (comp.type === 'nor_gate') outY = !(inA || inB);
        else if (comp.type === 'xor_gate') outY = (inA && !inB) || (!inA && inB);

        const yVoltage = outY ? 5.0 : 0.0;
        if (nodeY) nodeVoltages[nodeY] = yVoltage;

        logicStates[comp.id] = outY ? '1' : '0';
        compStates[comp.id] = { logicLevel: outY ? '1' : '0', voltage: yVoltage };
      }
    });

    // Check short circuit: Vcc directly connected to GND
    if (pwrComp) {
      const posNode = pinToNodeMap.get(`${pwrComp.id}_p1`);
      const negNode = pinToNodeMap.get(`${pwrComp.id}_p2`);
      if (posNode && negNode && posNode === negNode) {
        hasShortCircuit = true;
        warnings.push('🚨 حدوث قصر كهربائي مباشر (Short Circuit) بين القطب الموجب والسالب!');
      }
    }

    return {
      nodeVoltages,
      branchCurrents,
      logicStates,
      compStates,
      hasShortCircuit,
      warnings,
    };
  }

  /**
   * Get Voltage level heat-map color for a given voltage (Voltage Levels View)
   */
  public static getVoltageColor(voltage: number | undefined, maxVoltage: number = 12): string {
    if (voltage === undefined) return '#475569'; // slate-600
    if (voltage <= 0.1) return '#3b82f6'; // Blue for GND (0V)
    if (voltage >= maxVoltage - 0.5) return '#ef4444'; // Red for VCC (High)
    if (voltage >= maxVoltage * 0.5) return '#eab308'; // Yellow for Mid-High
    return '#10b981'; // Green for Mid
  }
}
