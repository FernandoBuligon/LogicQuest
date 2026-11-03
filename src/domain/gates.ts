import type { GateKind, InputHandle } from './types'

export const and = (a: boolean, b: boolean): boolean => a && b
export const or = (a: boolean, b: boolean): boolean => a || b
export const not = (a: boolean): boolean => !a
export const xor = (a: boolean, b: boolean): boolean => a !== b

export function inputHandles(gate: GateKind): InputHandle[] {
  return gate === 'NOT' ? ['in1'] : ['in1', 'in2']
}

export function evaluateGate(gate: GateKind, a: boolean, b = false): boolean {
  switch (gate) {
    case 'AND': return and(a, b)
    case 'OR': return or(a, b)
    case 'NOT': return not(a)
    case 'XOR': return xor(a, b)
  }
}
