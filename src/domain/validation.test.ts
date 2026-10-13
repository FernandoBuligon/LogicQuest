import { describe, expect, it, vi } from 'vitest'
import { inputCombinations, validateSolution, type LevelRules } from './validation'
import type { Circuit, GateKind, InputHandle } from './types'

const rules: LevelRules = { inputs: ['A', 'B'], availableGates: ['AND', 'OR', 'NOT', 'XOR'], maxGates: 4, expected: ({ A, B }) => A || B }
const wire = (source: string, target: string, targetHandle: InputHandle = 'in1') => ({ id: `${source}/${target}/${targetHandle}`, source, target, sourceHandle: 'out' as const, targetHandle })
function simple(gate: GateKind): Circuit {
  return {
    nodes: [{ id: 'A', kind: 'input', label: 'A' }, { id: 'B', kind: 'input', label: 'B' }, { id: 'g', kind: 'gate', gate }, { id: 'output', kind: 'output' }],
    wires: [wire('A', 'g'), wire('B', 'g', 'in2'), wire('g', 'output')],
  }
}

describe('validação por tabela-verdade', () => {
  it('enumera todas as combinações sem repetir', () => {
    const values = inputCombinations(['A', 'B', 'C', 'D'])
    expect(values).toHaveLength(16)
    expect(new Set(values.map(value => JSON.stringify(value))).size).toBe(16)
    expect(values[0]).toEqual({ A: false, B: false, C: false, D: false })
    expect(values[15]).toEqual({ A: true, B: true, C: true, D: true })
  })
  it('aprova circuito correto e testa todas as linhas', () => {
    const expected = vi.fn(rules.expected)
    const result = validateSolution(simple('OR'), { ...rules, expected })
    expect(result.status).toBe('passed')
    expect(result.rows).toHaveLength(4)
    expect(expected).toHaveBeenCalledTimes(4)
  })
  it('reprova coincidência de 00 com feedback de contraexemplo', () => {
    const result = validateSolution(simple('AND'), rules)
    expect(result.status).toBe('incorrect')
    if (result.status !== 'incorrect') throw new Error('Resultado incorreto esperado')
    expect(result.rows).toHaveLength(4)
    expect(result.mismatch).toEqual({ inputs: { A: false, B: true }, expected: true, actual: false })
  })
  it('aceita uma construção equivalente por De Morgan', () => {
    const circuit = simple('AND')
    circuit.nodes.push(...['na', 'nb', 'nout'].map(id => ({ id, kind: 'gate' as const, gate: 'NOT' as const })))
    circuit.wires = [wire('A', 'na'), wire('B', 'nb'), wire('na', 'g'), wire('nb', 'g', 'in2'), wire('g', 'nout'), wire('nout', 'output')]
    expect(validateSolution(circuit, rules).status).toBe('passed')
  })
  it('não ignora entradas extras ou faltantes', () => {
    const extra = simple('OR')
    extra.nodes.push({ id: 'C', kind: 'input', label: 'C' })
    expect(validateSolution(extra, rules).status).toBe('invalid')
    const missing = simple('OR')
    missing.nodes = missing.nodes.filter(node => node.id !== 'A')
    expect(validateSolution(missing, rules).status).toBe('invalid')
  })
  it('exige portas permitidas e respeita o limite', () => {
    expect(validateSolution(simple('OR'), { ...rules, availableGates: ['AND'] }).status).toBe('invalid')
    expect(validateSolution(simple('OR'), { ...rules, maxGates: 0 }).status).toBe('invalid')
  })
  it('reprova saída e entrada desconectadas', () => {
    for (const source of ['g', 'A']) {
      const circuit = simple('OR')
      circuit.wires = circuit.wires.filter(w => w.source !== source)
      expect(validateSolution(circuit, rules).status).toBe('invalid')
    }
  })
  it('reprova ciclos e portas incompletas fora do caminho da saída', () => {
    const circuit = simple('OR')
    circuit.nodes.push({ id: 'n', kind: 'gate', gate: 'NOT' })
    expect(validateSolution(circuit, rules).status).toBe('invalid')
    circuit.wires.push(wire('n', 'n'))
    expect(validateSolution(circuit, rules).status).toBe('invalid')
  })
  it('testa 16 combinações mesmo que algumas entradas não sejam usadas', () => {
    const circuit = simple('OR')
    circuit.nodes.push({ id: 'C', kind: 'input', label: 'C' }, { id: 'D', kind: 'input', label: 'D' })
    const result = validateSolution(circuit, { ...rules, inputs: ['A', 'B', 'C', 'D'] })
    expect(result.status).toBe('passed')
    expect(result.rows).toHaveLength(16)
  })
})
