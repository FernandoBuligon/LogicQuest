import type { GateKind } from '../../src/domain/types'

// Cada fio usa o índice global da porta (1-based), como os seletores da bancada.
export interface Solution { gates: GateKind[]; wires: [string, string, 1 | 2][] }
export const solutions: Solution[] = [
  { gates: ['AND'], wires: [['A', '1', 1], ['B', '1', 2], ['1', 'output', 1]] },
  { gates: ['OR'], wires: [['A', '1', 1], ['B', '1', 2], ['1', 'output', 1]] },
  { gates: ['NOT'], wires: [['A', '1', 1], ['1', 'output', 1]] },
  { gates: ['XOR'], wires: [['A', '1', 1], ['B', '1', 2], ['1', 'output', 1]] },
  { gates: ['AND', 'NOT', 'OR'], wires: [['A', '1', 1], ['B', '1', 2], ['C', '2', 1], ['1', '3', 1], ['2', '3', 2], ['3', 'output', 1]] },
  { gates: ['XOR', 'AND', 'NOT', 'OR'], wires: [['A', '1', 1], ['B', '1', 2], ['1', '2', 1], ['C', '2', 2], ['D', '3', 1], ['2', '4', 1], ['3', '4', 2], ['4', 'output', 1]] },
  { gates: ['AND', 'AND', 'AND', 'OR', 'OR'], wires: [['A', '1', 1], ['B', '1', 2], ['A', '2', 1], ['C', '2', 2], ['B', '3', 1], ['C', '3', 2], ['1', '4', 1], ['2', '4', 2], ['4', '5', 1], ['3', '5', 2], ['5', 'output', 1]] },
  { gates: ['NOT', 'AND', 'AND', 'OR'], wires: [['S', '1', 1], ['A', '2', 1], ['1', '2', 2], ['B', '3', 1], ['S', '3', 2], ['2', '4', 1], ['3', '4', 2], ['4', 'output', 1]] },
  { gates: ['XOR', 'XOR', 'XOR'], wires: [['A', '1', 1], ['B', '1', 2], ['C', '2', 1], ['D', '2', 2], ['1', '3', 1], ['2', '3', 2], ['3', 'output', 1]] },
  { gates: ['XOR', 'XOR', 'OR', 'NOT'], wires: [['A', '1', 1], ['C', '1', 2], ['B', '2', 1], ['D', '2', 2], ['1', '3', 1], ['2', '3', 2], ['3', '4', 1], ['4', 'output', 1]] },
  { gates: ['OR', 'AND', 'NOT', 'OR', 'AND', 'NOT', 'AND'], wires: [['A', '1', 1], ['B', '1', 2], ['A', '2', 1], ['B', '2', 2], ['C', '3', 1], ['3', '4', 1], ['2', '4', 2], ['1', '5', 1], ['4', '5', 2], ['D', '6', 1], ['5', '7', 1], ['6', '7', 2], ['7', 'output', 1]] },
]
