import { useState } from 'react'
import { ArrowRight, BookOpen, Lightbulb } from 'lucide-react'
import type { Level } from '../levels/levels'
import { inputCombinations } from '../domain/validation'
import { Button } from './ui/button'

export default function LessonPanel({ level }: { level: Level }) {
  const [tab, setTab] = useState<'mission' | 'learn' | 'table'>('mission')
  const [hint, setHint] = useState(-1)
  const [showAnswer, setShowAnswer] = useState(false)
  return <aside className="lesson-panel" aria-label="Instruções da fase">
    <div className="lesson-tabs" role="tablist" aria-label="Material de aprendizado">
      {([{ id: 'mission', label: 'Missão' }, { id: 'learn', label: 'Aprender' }, { id: 'table', label: 'Tabela' }] as const).map(({ id, label }) => <button key={id} id={`lesson-${id}`} role="tab" aria-selected={tab === id} aria-controls={`panel-${id}`} onClick={() => setTab(id)} onKeyDown={event => {
        const tabs = ['mission', 'learn', 'table'] as const
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft' || event.key === 'Home' || event.key === 'End') {
          event.preventDefault()
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (tabs.indexOf(id) + (event.key === 'ArrowRight' ? 1 : 2)) % 3
          setTab(tabs[next]); document.getElementById(`lesson-${tabs[next]}`)?.focus()
        }
      }} tabIndex={tab === id ? 0 : -1}>{label}</button>)}
    </div>
    <div className="lesson-content" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`lesson-${tab}`} tabIndex={0}>
      {tab === 'mission' && <><span className="small-label">O PROBLEMA</span><h2>Uma ideia para colocar em prática.</h2><p>{level.context}</p><div className="mission-objective"><span className="small-label">SEU OBJETIVO</span><p>{level.instruction}</p></div><div className="lesson-constraints"><span>{level.inputs.length} entradas</span><span>Até {level.maxGates} {level.maxGates === 1 ? 'porta' : 'portas'}</span><span>{2 ** level.inputs.length} testes</span></div><div className="hint-box"><div><Lightbulb aria-hidden="true" size={18} /><strong>{level.module === 'tutorial' ? 'Passo a passo' : 'Uma pista de cada vez'}</strong></div>{hint >= 0 && <p aria-live="polite">{level.hints[hint]}</p>}<Button size="sm" variant="ghost" onClick={() => setHint(current => (current + 1) % level.hints.length)}>{hint < 0 ? level.module === 'tutorial' ? 'Como começar' : 'Preciso de uma dica' : `${hint + 1}/${level.hints.length} · Próxima dica`}<ArrowRight aria-hidden="true" size={14} /></Button></div><button className="text-link" onClick={() => setTab('learn')}><BookOpen aria-hidden="true" size={15} />Entenda o raciocínio antes de montar</button></>}
      {tab === 'learn' && <><span className="small-label">POR TRÁS DO CIRCUITO</span><h2>{level.topic}</h2><p>{level.explanation}</p><div className="example-box"><strong>Vamos pensar em um exemplo?</strong><p>{level.example}</p></div><code className="formula">{level.objective}</code><div className="reflection"><strong>Para pensar</strong><p>{level.question}</p><Button size="sm" variant="outline" aria-expanded={showAnswer} onClick={() => setShowAnswer(!showAnswer)}>{showAnswer ? 'Esconder explicação' : 'Conferir meu raciocínio'}</Button>{showAnswer && <p className="answer" role="status">{level.answer}</p>}</div></>}
      {tab === 'table' && <><span className="small-label">TODAS AS POSSIBILIDADES</span><h2>Tabela-verdade</h2><p>As entradas representam condições. A coluna <strong>Saída</strong> mostra o que seu circuito deve produzir. Com {level.inputs.length} entradas, existem 2<sup>{level.inputs.length}</sup> = {2 ** level.inputs.length} combinações.</p><div className="table-scroll"><table><caption>Resultado esperado em cada combinação</caption><thead><tr>{level.inputs.map(id => <th key={id} scope="col">{id}</th>)}<th scope="col">Saída</th></tr></thead><tbody>{inputCombinations(level.inputs).map((inputs, index) => <tr key={index}>{level.inputs.map(id => <td key={id}>{Number(inputs[id])}</td>)}<td><span className={`bit ${level.expected(inputs) ? 'on' : ''}`}>{Number(level.expected(inputs))}</span></td></tr>)}</tbody></table></div></>}
    </div>
    <div className="lesson-bottom">0 = desligado <span>·</span> 1 = ligado</div>
  </aside>
}
