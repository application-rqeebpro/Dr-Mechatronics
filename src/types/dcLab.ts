export type ComponentType =
  | 'dc_source'
  | 'current_source'
  | 'battery'
  | 'resistor'
  | 'potentiometer'
  | 'rheostat'
  | 'switch'
  | 'pushbutton'
  | 'ground'
  | 'diode'
  | 'led'
  | 'npn_bjt'
  | 'pnp_bjt'
  | 'n_mosfet'
  | 'relay'
  | 'dc_motor'
  | 'servo_motor'
  | 'buzzer'
  | 'bulb'
  | 'capacitor'
  | 'inductor'
  | 'signal_generator'
  | 'oscilloscope'
  | 'voltmeter'
  | 'ammeter'
  | 'ohmmeter';

export interface CircuitTerminal {
  id: string; // e.g., 't1', 't2', 'base', 'collector', 'emitter', 'gate', 'drain', 'source'
  x: number;  // relative to component position
  y: number;
  label?: string;
  breadboardHoleId?: string; // e.g., 'row_15_C' or 'rail_top_plus'
}

export interface CircuitElement {
  id: string;
  type: ComponentType;
  name: string;
  value: number; // in base units: Volts, Ohms, Farads, Henrys, Amps
  unit: string;  // V, Ω, kΩ, μF, mH, A
  x: number;     // position on workspace grid
  y: number;
  rotation: 0 | 90 | 180 | 270;
  terminals: CircuitTerminal[];
  isOpen?: boolean; // for switches & pushbuttons
  wiperPercent?: number; // for potentiometers (0 to 100%)
  maxPowerRating?: number; // Watts
  tolerance?: number; // percent
  color?: string;
  // Semiconductor & Actuator specific properties
  beta?: number; // BJT current gain (hFE), default 100
  vth?: number;  // MOSFET threshold voltage, default 2.0V
  forwardDrop?: number; // Diode/LED forward threshold (0.7V for 1N4007, 2.0V for LED)
  coilResistance?: number; // Relay coil resistance (e.g. 100Ω)
  isEnergized?: boolean;   // Relay coil state
  motorRpm?: number;       // DC motor rotation speed
  isGlowing?: boolean;     // LED / bulb emission
  isBeeping?: boolean;     // Buzzer sound state
  frequency?: number;      // Signal generator frequency in Hz
  amplitude?: number;      // Signal generator peak amplitude in V
  waveType?: 'sine' | 'square' | 'triangle';
}

export interface CircuitWire {
  id: string;
  fromComponentId: string;
  fromTerminalId: string;
  toComponentId: string;
  toTerminalId: string;
  color?: string;
}

export type MeterMode = 'voltmeter' | 'ammeter' | 'ohmmeter' | 'wattmeter';

export interface MeterDevice {
  id: string;
  type: MeterMode;
  name: string;
  range: 'auto' | '200mV' | '2V' | '20V' | '200V' | '2mA' | '20mA' | '200mA' | '10A' | '200Ω' | '2kΩ' | '20kΩ' | '200kΩ' | '2MΩ';
  probeRedConnectedTo?: { componentId: string; terminalId: string };
  probeBlackConnectedTo?: { componentId: string; terminalId: string };
  currentReading: number;
  unit: string;
  displayState: 'normal' | 'overload' | 'error' | 'reverse_polarity';
  warningMessage?: string;
}

export interface ComponentSimulationData {
  voltageDrop: number;   // Volts (V_term1 - V_term2)
  current: number;       // Amperes (flowing from term1 to term2)
  power: number;         // Watts (V * I)
  node1Voltage: number;  // Volts relative to GND
  node2Voltage: number;  // Volts relative to GND
  isBurnedOut?: boolean; // if exceeded power rating
}

export interface SimulationResult {
  timestamp: number;
  nodeVoltages: Record<string, number>; // nodeId -> voltage in V
  elementData: Record<string, ComponentSimulationData>; // componentId -> data
  totalPowerSupplied: number; // Watts
  totalPowerDissipated: number; // Watts
  hasGround: boolean;
  isShortCircuit: boolean;
  isOpenCircuit: boolean;
  shortPath?: string[];
  kclErrors: string[];
  diagnosticMessages: {
    type: 'info' | 'warning' | 'error' | 'success';
    messageAr: string;
    messageEn: string;
    componentId?: string;
  }[];
  transientCurve?: {
    timePoints: number[]; // seconds
    voltages: number[];   // V
    currents: number[];   // A
    tau: number;          // time constant (seconds)
    type: 'rc_charge' | 'rc_discharge' | 'rl_charge' | 'rl_discharge';
  };
}

export interface MeasurementRecord {
  id: string;
  stepNumber: number;
  quantityNameAr: string;
  quantityNameEn: string;
  symbol: string;
  theoreticalValue: number;
  measuredValue: number;
  unit: string;
  percentError: number; // |Theo - Meas| / Theo * 100
  notes?: string;
}

export interface DiscussionQuestion {
  id: string;
  questionAr: string;
  questionEn: string;
  modelAnswerAr: string;
  modelAnswerEn: string;
}

export interface LabQuizItem {
  id: string;
  questionAr: string;
  questionEn: string;
  optionsAr: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationAr: string;
}

export interface FioreExperiment {
  id: string;
  number: number;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  objectivesAr: string[];
  objectivesEn: string[];
  theoryAr: string;
  theoryEn: string;
  formulas: {
    name: string;
    formula: string;
    descriptionAr: string;
  }[];
  requiredEquipmentAr: string[];
  requiredEquipmentEn: string[];
  schematicSvgOrKey: string;
  procedureStepsAr: string[];
  procedureStepsEn: string[];
  defaultCircuit: {
    components: CircuitElement[];
    wires: CircuitWire[];
  };
  expectedMeasurements: {
    parameter: string;
    symbol: string;
    theoreticalFormula: string;
    typicalTheoretical: number;
    unit: string;
  }[];
  discussionQuestions: DiscussionQuestion[];
  preQuiz: LabQuizItem[];
  postQuiz: LabQuizItem[];
  practicalApplicationAr: string;
  commonMistakesAr: string[];
}

export interface LabSubmissionReport {
  id: string;
  experimentNumber: number;
  experimentTitle: string;
  studentName: string;
  studentEmail: string;
  date: string;
  measurements: MeasurementRecord[];
  preQuizScore: { score: number; total: number };
  postQuizScore: { score: number; total: number };
  answersToDiscussion: Record<string, string>;
  conclusionAr: string;
  instructorFeedback?: string;
  grade?: number;
  isCompleted: boolean;
}
