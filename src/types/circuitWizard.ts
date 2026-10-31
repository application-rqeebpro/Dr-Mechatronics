export type ViewMode =
  | 'normal'
  | 'voltage_levels'
  | 'current_flow'
  | 'logic_levels'
  | 'standard'
  | 'breadboard';

export type WorkspaceTab =
  | 'circuit_diagram'
  | 'pcb_layout'
  | 'flowchart'
  | 'bill_of_materials';

export type ComponentCategory =
  | 'power_supplies'
  | 'connectors'
  | 'input_components'
  | 'passive_components'
  | 'discrete_semiconductors'
  | 'logic_gates'
  | 'integrated_circuits'
  | 'output_components';

export interface CwPin {
  id: string;
  name: string;
  x: number; // offset relative to comp center on schematic
  y: number;
  pcbX: number; // offset relative to comp center on PCB
  pcbY: number;
  type?: 'in' | 'out' | 'pwr' | 'gnd';
}

export interface CwPad {
  id: string;
  x: number;
  y: number;
  holeRadius: number;
  padRadius: number;
}

export interface CwFootprint {
  width: number;
  height: number;
  pads: CwPad[];
}

export interface CwComponent {
  id: string;
  type: string;
  category: ComponentCategory;
  name: string; // e.g. "R1", "C1", "IC1", "Q1", "BAT1"
  value: number;
  unit: string;
  x: number;
  y: number;
  pcbX: number;
  pcbY: number;
  rotation: number; // 0, 90, 180, 270
  pins: CwPin[];
  package: string; // e.g. "DIP-8", "TO-92", "Axial-0.4"
  footprint: CwFootprint;
  costEst: number;
  descriptionAr: string;
  descriptionEn: string;

  // Live state values calculated by solver
  state?: {
    voltage?: number;
    current?: number;
    power?: number;
    logicLevel?: '0' | '1' | 'X';
    isGlow?: boolean;
    rpm?: number;
    isBeeping?: boolean;
    isOpen?: boolean;
    nodeVoltages?: Record<string, number>;
  };
}

export interface CwWire {
  id: string;
  fromCompId: string;
  fromPinId: string;
  toCompId: string;
  toPinId: string;
  color: string;
  wireType?: 'signal' | 'power' | 'ground';
  pcbTrace?: {
    points: { x: number; y: number }[];
    layer: 'top' | 'bottom';
    width: number;
  };
}

export interface CwFlowchartNode {
  id: string;
  type: 'start' | 'input' | 'decision' | 'output' | 'delay' | 'end';
  label: string;
  expression?: string;
  x: number;
  y: number;
  nextId?: string;
  yesNextId?: string;
  noNextId?: string;
}

export interface SampleCircuitProject {
  id: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  descriptionAr: string;
  components: CwComponent[];
  wires: CwWire[];
  flowchart?: CwFlowchartNode[];
}

export interface CwSolverResult {
  nodeVoltages: Record<string, number>;
  branchCurrents: Record<string, number>;
  logicStates: Record<string, '0' | '1' | 'X'>;
  compStates: Record<string, any>;
  hasShortCircuit: boolean;
  warnings: string[];
}
