import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, CircuitBoard, Lock, Play, Trophy } from 'lucide-react'
import { Button } from '../components/ui/button'
import CircuitEditor from '../circuit/CircuitEditor'
import type { Draft } from '../circuit/model'
import { gateLessons, isUnlocked, levels } from '../levels/levels'
import { validateSolution, type Validation } from '../domain/validation'
import ValidationFeedback from '../components/ValidationFeedback'
import LabIllustration from '../components/LabIllustration'

type Screen = 'home' | 'levels' | 'game' | 'success'
export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [activeId, setActiveId] = useState(1)
  const [completed, setCompleted] = useState<number[]>([])
  const [drafts, setDrafts] = useState<Record<number, Draft>>({})
  const [result, setResult] = useState<Validation | null>(null)
  const mainRef = useRef<HTMLElement>(null)
  useEffect(() => { mainRef.current?.querySelector('h1')?.focus() }, [screen, activeId])
  const level = levels.find(item => item.id === activeId)!
  function openLevel(id: number) {
    if (!isUnlocked(id, completed)) return
    setActiveId(id)
    setResult(null)
    setScreen('game')
  }
  return <div className="app-shell">
    <a href="#main-content" className="skip-link">Pular para o conteúdo</a>
    <header className="app-header"><button className="brand" onClick={() => setScreen('home')} aria-label="Logic Quest — menu inicial"><CircuitBoard size={28} aria-hidden="true" /><span>Logic Quest<small>O Laboratório de Circuitos</small></span></button><span className="progress-badge">{completed.length} / 6 sistemas restaurados</span></header>
    <main id="main-content" ref={mainRef}>
      {screen === 'home' && <section className="home-screen">
        <div className="home-copy">
        <span className="eyebrow">Laboratório de lógica · missão de restauração</span>
        <h1 tabIndex={-1}>Logic Quest</h1><p className="home-subtitle">A lógica está nas suas mãos.</p>
        <p>O laboratório perdeu seus circuitos. Combine portas lógicas, experimente os sinais e restaure seis sistemas — uma descoberta de cada vez.</p>
        <div className="home-actions"><Button size="lg" onClick={() => openLevel(activeId)}><Play size={18} />{completed.length ? 'Continuar missão' : 'Iniciar missão'}</Button><Button variant="outline" size="lg" onClick={() => setScreen('levels')}>Selecionar fase<ArrowRight size={18} /></Button></div>
        </div><LabIllustration />
        <div className="intro-steps"><article><strong>01 · Monte</strong><p>Adicione portas e conecte entradas e saídas.</p></article><article><strong>02 · Experimente</strong><p>Alterne 0 e 1 para acompanhar os sinais.</p></article><article><strong>03 · Verifique</strong><p>Teste todas as combinações e libere a próxima fase.</p></article></div>
      </section>}
      {screen === 'levels' && <section className="levels-screen"><span className="eyebrow">Mapa do laboratório</span><h1 tabIndex={-1}>Selecione uma fase</h1><p>Restaure os sistemas em sequência. Fases concluídas podem ser revisitadas.</p><div className="level-grid">{levels.map(item => {
        const done = completed.includes(item.id)
        const unlocked = isUnlocked(item.id, completed)
        return <article className={`level-card ${done ? 'complete' : ''}`} key={item.id}><span className="level-number">{String(item.id).padStart(2, '0')}</span><span className="level-state">{done ? <><Check size={16} />Concluída</> : unlocked ? 'Disponível' : <><Lock size={14} />Bloqueada</>}</span><h2>{item.name}</h2><p>{item.context}</p><span className="level-meta">{item.inputs.length} entradas · {item.availableGates.join(' / ')}</span><Button variant={done ? 'outline' : 'default'} disabled={!unlocked} onClick={() => openLevel(item.id)} aria-label={`${done ? 'Revisitar' : 'Jogar'} fase ${item.id}`}>{done ? 'Revisitar' : unlocked ? 'Entrar no sistema' : 'Conclua as fases anteriores'}<ArrowRight size={16} /></Button></article>
      })}</div><Button variant="ghost" onClick={() => setScreen('home')}>Voltar ao menu</Button></section>}
      {screen === 'game' && <section className="game-screen"><div className="mission-heading"><span className="eyebrow">Sistema {String(level.id).padStart(2, '0')} / 06</span><h1 tabIndex={-1}>{level.name}</h1><p>{level.context}</p></div>
        <aside className="mission-brief" aria-label="Instruções da fase"><div><h2>Sua missão</h2><p>{level.instruction}</p><code>{level.objective}</code></div><div><h2>Conheça as portas</h2>{level.availableGates.map(gate => <p key={gate}>{gateLessons[gate]}</p>)}</div></aside>
        <p className="first-steps">1. Adicione uma porta. 2. Arraste seus pontos para conectar saída → entrada. 3. Alterne os interruptores e teste. Arraste a porta para movê-la; selecione um fio e pressione Delete para removê-lo.</p>
        <CircuitEditor key={level.id} rules={level} initialDraft={drafts[level.id]} onBack={() => { setResult(null); setScreen('levels') }} onDraftChange={draft => {
          setDrafts(current => ({ ...current, [level.id]: draft }))
          setResult(null)
        }} onTest={circuit => {
          const validation = validateSolution(circuit, level)
          setResult(validation)
          if (validation.status === 'passed') {
            setCompleted(current => [...new Set([...current, level.id])].sort((a, b) => a - b))
            setScreen('success')
          }
        }} />
        {result && <ValidationFeedback result={result} inputs={level.inputs} />}
      </section>}
      {screen === 'success' && result && <section className="success-screen"><Trophy size={52} aria-hidden="true" /><span className="eyebrow">Sistema {level.id} restaurado</span><h1 tabIndex={-1}>{level.id === 6 ? 'Laboratório restaurado!' : 'Missão cumprida!'}</h1><p>{level.success}</p><ValidationFeedback result={result} inputs={level.inputs} /><div className="home-actions">{level.id < 6 && <Button onClick={() => openLevel(level.id + 1)}>Próxima fase<ArrowRight size={18} /></Button>}<Button variant="outline" onClick={() => setScreen('levels')}>Selecionar fase</Button><Button variant="ghost" onClick={() => openLevel(level.id)}>Revisitar circuito</Button></div></section>}
    </main>
    <footer>0 é desligado. 1 é ligado. Cada conexão é uma nova descoberta.</footer>
  </div>
}
