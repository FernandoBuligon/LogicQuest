import { evaluateCircuit, inspectCircuit } from './engine'
import type { Circuit, GateKind, InputValues } from './types'

export interface LevelRules {
  inputs: string[]
  availableGates: GateKind[]
  maxGates: number
  expected: (inputs: InputValues) => boolean
}
export interface TruthRow { inputs: InputValues; expected: boolean; actual: boolean }
export type Validation =
  | { status: 'invalid'; messages: string[]; rows: [] }
  | { status: 'incorrect'; rows: TruthRow[]; mismatch: TruthRow }
  | { status: 'passed'; rows: TruthRow[] }

export function inputCombinations(ids: string[]): InputValues[] {
  return Array.from({ length: 2 ** ids.length }, (_, combination) => Object.fromEntries(
    ids.map((id, i) => [id, Boolean(combination & (2 ** (ids.length - i - 1)))]),
  ))
}

export function validateSolution(circuit: Circuit, rules: LevelRules): Validation {
  const messages = inspectCircuit(circuit).map(issue => issue.message)
  const inputs = circuit.nodes.filter(node => node.kind === 'input')
  if (inputs.length !== rules.inputs.length || !rules.inputs.every(id => inputs.some(node => node.id === id))) {
    messages.push('Use exatamente as entradas fixas desta fase.')
  }
  const gates = circuit.nodes.filter(node => node.kind === 'gate')
  if (gates.length > rules.maxGates) messages.push(`Esta fase permite no máximo ${rules.maxGates} portas.`)
  if (gates.some(node => !rules.availableGates.includes(node.gate))) messages.push('Use apenas as portas disponíveis nesta fase.')
  if (messages.length) return { status: 'invalid', messages: [...new Set(messages)], rows: [] }
  const rows: TruthRow[] = []
  for (const inputs of inputCombinations(rules.inputs)) {
    const evaluation = evaluateCircuit(circuit, inputs)
    if (!evaluation.ok || evaluation.output === null) {
      return { status: 'invalid', messages: evaluation.issues.map(issue => issue.message), rows: [] }
    }
    rows.push({ inputs, expected: rules.expected(inputs), actual: evaluation.output })
  }
  const mismatch = rows.find(row => row.expected !== row.actual)
  return mismatch ? { status: 'incorrect', rows, mismatch } : { status: 'passed', rows }
}
