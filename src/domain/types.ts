export type GateKind = 'AND' | 'OR' | 'NOT' | 'XOR'
export type InputHandle = 'in1' | 'in2'
export type OutputHandle = 'out'
export type CircuitNode =
  | { id: string; kind: 'input'; label: string }
  | { id: string; kind: 'gate'; gate: GateKind }
  | { id: string; kind: 'output' }

export interface Wire {
  id: string
  source: string
  sourceHandle: OutputHandle
  target: string
  targetHandle: InputHandle
}

export interface Circuit { nodes: CircuitNode[]; wires: Wire[] }
export type InputValues = Record<string, boolean>
export type Signal = boolean | null
export type IssueCode = 'duplicate' | 'missing-node' | 'invalid-connection' | 'occupied' | 'cycle' | 'incomplete' | 'missing-value' | 'output-count'
export interface CircuitIssue { code: IssueCode; message: string; nodeId?: string }
export interface Evaluation {
  ok: boolean
  output: Signal
  nodeSignals: Record<string, Signal>
  wireSignals: Record<string, Signal>
  issues: CircuitIssue[]
}
