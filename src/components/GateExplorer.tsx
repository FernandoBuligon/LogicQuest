import { useState } from 'react'
import { Lightbulb } from 'lucide-react'
import type { GateKind } from '../domain/types'
import { evaluateGate } from '../domain/gates'
import { gateLessons } from '../levels/levels'
import GateSymbol from './GateSymbol'

export default function GateExplorer() {
  const [gate, setGate] = useState<GateKind>('AND')
  const [a, setA] = useState(false)
  const [b, setB] = useState(true)
  const output = evaluateGate(gate, a, b)
  return <div className="gate-explorer">
    <div className="explorer-tabs" aria-label="Escolha uma porta">{(['AND', 'OR', 'NOT', 'XOR'] as GateKind[]).map(kind => <button key={kind} aria-pressed={gate === kind} onClick={() => setGate(kind)}>{kind}</button>)}</div>
    <div className="live-circuit">
      <div className="live-inputs"><button aria-label="Alternar sinal A" aria-pressed={a} onClick={() => setA(!a)}><span>A</span><strong>{Number(a)}</strong><span className={`mini-switch ${a ? 'on' : ''}`} /></button>{gate !== 'NOT' && <button aria-label="Alternar sinal B" aria-pressed={b} onClick={() => setB(!b)}><span>B</span><strong>{Number(b)}</strong><span className={`mini-switch ${b ? 'on' : ''}`} /></button>}</div>
      <div className="live-wire" /><div className={`live-gate gate-${gate.toLowerCase()}`}><GateSymbol gate={gate} size={60} /><strong>{gate}</strong></div><div className={`live-wire ${output ? 'on' : ''}`} /><div className={`live-output ${output ? 'on' : ''}`} aria-live="polite" aria-atomic="true"><Lightbulb aria-hidden="true" size={30} /><strong><span className="sr-only">Saída: </span>{Number(output)}</strong></div>
    </div>
    <p className="explorer-rule">{gateLessons[gate]}</p>
    <span className="explorer-caption">Toque nos interruptores. Veja a lógica acontecer.</span>
  </div>
}
