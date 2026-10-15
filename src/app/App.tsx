import { useEffect, useRef, useState } from 'react'
import { ArrowRight, BookOpen, Check, ChevronLeft, ChevronRight, CircuitBoard, CircleHelp, FlaskConical, Home, Lock, Map, RotateCcw, X } from 'lucide-react'
import { Button } from '../components/ui/button'
import CircuitEditor from '../circuit/CircuitEditor'
import type { Draft } from '../circuit/model'
import { isUnlocked, levels, modules, type Module } from '../levels/levels'
import { validateSolution, type Validation } from '../domain/validation'
import ValidationFeedback from '../components/ValidationFeedback'
import LabIllustration from '../components/LabIllustration'
import PhaseHelp from '../components/PhaseHelp'
import GateExplorer from '../components/GateExplorer'
import GuideBook from '../components/GuideBook'
import { initialProgress, loadProgress, saveProgress, type Progress } from '../storage/progress'

type Screen = 'home' | 'levels' | 'game' | 'success' | 'guide'
const navItems = [
  { screen: 'home', label: 'Meu espaço', Icon: Home },
  { screen: 'levels', label: 'Trilha de aprendizado', Icon: Map },
  { screen: 'guide', label: 'Guia de lógica', Icon: BookOpen },
] as const

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [{ progress, available }, setSavedProgress] = useState(loadProgress)
  const activeId = progress.lastLevel
  const completed = progress.completed
  const [levelPage, setLevelPage] = useState(0)
  const [compact, setCompact] = useState(() => window.innerWidth <= 760)
  const [narrow, setNarrow] = useState(() => window.innerWidth <= 370)
  const [guideMode, setGuideMode] = useState<'concepts' | 'explore'>('concepts')
  const [module, setModule] = useState<Module>('tutorial')
  const [help, setHelp] = useState<'intro' | 'material' | null>(null)
  const helpButtonRef = useRef<HTMLButtonElement>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const resetButtonRef = useRef<HTMLButtonElement>(null)
  const resetWasOpen = useRef(false)
  const [drafts, setDrafts] = useState<Record<number, Draft>>({})
  const [result, setResult] = useState<Validation | null>(null)
  const mainRef = useRef<HTMLElement>(null)
  useEffect(() => { mainRef.current?.querySelector('h1')?.focus() }, [screen, activeId])
  useEffect(() => {
    if (!confirmReset && resetWasOpen.current) resetButtonRef.current?.focus()
    resetWasOpen.current = confirmReset
  }, [confirmReset])
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 760px)')
    const small = window.matchMedia('(max-width: 370px)')
    const resize = () => { setCompact(mobile.matches); setNarrow(small.matches) }
    mobile.addEventListener('change', resize); small.addEventListener('change', resize)
    return () => { mobile.removeEventListener('change', resize); small.removeEventListener('change', resize) }
  }, [])
  const moduleLevels = levels.filter(item => item.module === module)
  const perPage = narrow ? 1 : compact ? 2 : 6
  const pageCount = Math.ceil(moduleLevels.length / perPage)
  const currentPage = Math.min(levelPage, pageCount - 1)
  function selectModule(next: Module) { setModule(next); setLevelPage(0) }
  const level = levels.find(item => item.id === activeId)!
  const nextLevel = levels.find(item => !completed.includes(item.id)) ?? levels[levels.length - 1]
  const currentModule = modules.find(item => item.id === module)!
  const gateLabels = Object.fromEntries((drafts[activeId]?.circuit.nodes ?? [])
    .filter(node => node.kind === 'gate')
    .map((node, index) => [`Porta ${node.gate} (${node.id})`, `Porta ${node.gate} ${index + 1}`]))
  function updateProgress(next: Progress) {
    setSavedProgress({ progress: next, available: saveProgress(next) })
  }
  function openLevel(id: number) {
    if (!isUnlocked(id, completed)) return
    updateProgress({ ...progress, lastLevel: id })
    setModule(levels.find(item => item.id === id)!.module)
    setLevelPage(0)
    setResult(null)
    setHelp('intro')
    setScreen('game')
  }
  function navigate(next: Screen) { setResult(null); setScreen(next) }
  const selectedNav = screen === 'game' || screen === 'success' ? 'levels' : screen
  return <div className={`app-shell ${screen === 'game' ? 'is-playing' : ''}`}>
    <a href="#main-content" className="skip-link">Pular para o conteúdo</a>
    <aside className="app-sidebar" inert={confirmReset}>
      <button className="brand" onClick={() => navigate('home')} aria-label="Logic Quest — menu inicial" translate="no">
        <span className="brand-mark"><CircuitBoard aria-hidden="true" size={22} /></span><span>logicquest<span className="brand-period">.</span></span>
      </button>
      <nav aria-label="Navegação principal">
        {navItems.map(({ screen: target, label, Icon }) => <button key={target} aria-label={label} className={selectedNav === target ? 'active' : ''} aria-current={selectedNav === target ? 'page' : undefined} onClick={() => navigate(target)}><Icon aria-hidden="true" size={19} /><span>{label}</span></button>)}
      </nav>
      <Button ref={resetButtonRef} aria-label="Reiniciar progresso" variant="ghost" size="sm" className="reset-progress" onClick={() => setConfirmReset(true)}><RotateCcw aria-hidden="true" size={16} /><span>Reiniciar progresso</span></Button>
    </aside>
    <div className="app-workspace">
      <header className="app-header" inert={confirmReset}>
        <span className="header-location">Laboratório de lógica</span>
        <button className="mobile-brand" translate="no" aria-label="Logic Quest — menu inicial" onClick={() => navigate('home')}>logicquest<span className="brand-period">.</span></button>
        <div className="header-progress"><span>{completed.length} / {levels.length} etapas concluídas</span><progress max={levels.length} value={completed.length} aria-label="Progresso na trilha" /></div>
      </header>
      <main id="main-content" ref={mainRef} inert={confirmReset}>
        {!available && <p className="storage-notice" role="status">O navegador não permite salvar o progresso. Você pode jogar nesta sessão; as conquistas podem se perder ao recarregar.</p>}
        {screen === 'home' && <section className="home-screen">
          <div className="home-hero">
            <div className="home-copy">
              <span className="eyebrow">APRENDA EXPERIMENTANDO</span>
              <h1 tabIndex={-1}>Entenda a lógica.<br /><span className="accent-text">Conecte suas ideias.</span></h1>
              <p>Descubra como os computadores tomam decisões. Monte circuitos, teste possibilidades e aprenda no seu ritmo.</p>
              <Button size="lg" onClick={() => openLevel(completed.length ? completed.includes(activeId) ? nextLevel.id : activeId : 1)}>{completed.length ? 'Continuar aprendizado' : 'Começar a aprender'}<ArrowRight aria-hidden="true" size={18} /></Button>
              <span className="hero-caption">4 tutoriais guiados · 7 etapas para praticar</span>
            </div>
            <LabIllustration />
          </div>
          <div className="home-next">
            <div className="next-heading"><h2>{completed.length === levels.length ? 'Explore de novo' : 'Sua próxima etapa'}</h2><button className="text-link" onClick={() => { setModule(nextLevel.module); navigate('levels') }} aria-label="Selecionar fase">Ver trilha<ArrowRight aria-hidden="true" size={16} /></button></div>
            <div className="next-lesson"><span className="lesson-number">{String(nextLevel.id).padStart(2, '0')}</span><div><h3>{nextLevel.name}</h3><p>{nextLevel.topic}</p></div><Button variant="outline" onClick={() => openLevel(nextLevel.id)} aria-label={`Abrir etapa ${nextLevel.id}`}>Abrir etapa<ArrowRight aria-hidden="true" size={16} /></Button></div>
          </div>
          <div className="home-help"><p>Quer revisar os conceitos?</p><button className="text-link" onClick={() => navigate('guide')}>Conhecer o guia<ArrowRight aria-hidden="true" size={16} /></button></div>
        </section>}
        {screen === 'levels' && <section className="levels-screen"><div className="page-heading"><div><h1 tabIndex={-1}>Sua trilha de aprendizado</h1><p>Dos primeiros sinais aos seus próprios circuitos.</p></div></div>
          <div className="module-tabs" role="tablist" aria-label="Módulos da trilha">{modules.map((item, index) => <button key={item.id} id={`module-${item.id}`} role="tab" aria-selected={module === item.id} aria-controls="module-content" tabIndex={module === item.id ? 0 : -1} onClick={() => selectModule(item.id)} onKeyDown={event => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowRight' ? 1 : 2)) % 3; selectModule(modules[next].id); document.getElementById(`module-${modules[next].id}`)?.focus() } }}><span>{item.label}</span><span className="module-count">{completed.filter(id => levels.find(l => l.id === id)?.module === item.id).length}/{levels.filter(l => l.module === item.id).length}</span></button>)}</div>
          <div className="module-content" id="module-content" role="tabpanel" aria-labelledby={`module-${module}`}><div className="module-description"><h2>{currentModule.name}</h2><p>{currentModule.description}</p></div><div className={`level-grid module-${module}`}>{moduleLevels.slice(currentPage * perPage, (currentPage + 1) * perPage).map(item => {
            const done = completed.includes(item.id)
            const unlocked = isUnlocked(item.id, completed)
            return <article className={`level-card ${done ? 'complete' : ''} ${!unlocked ? 'locked' : ''}`} key={item.id}><div className="level-card-top"><span className="level-number">{String(item.id).padStart(2, '0')}</span><span className="level-state">{done ? <><Check aria-hidden="true" size={13} />Concluída</> : unlocked ? <>Disponível</> : <><Lock aria-hidden="true" size={12} />Bloqueada</>}</span></div><h3>{item.name}</h3><p>{item.topic}</p><span className="level-meta">{item.inputs.length} entradas <span>·</span> Até {item.maxGates} {item.maxGates === 1 ? 'porta' : 'portas'} <span>·</span> {2 ** item.inputs.length} combinações</span><Button variant={done || !unlocked ? 'outline' : 'default'} disabled={!unlocked} onClick={() => openLevel(item.id)} aria-label={`${done ? 'Revisitar' : 'Jogar'} fase ${item.id}`}>{done ? 'Revisitar etapa' : unlocked ? item.module === 'tutorial' ? 'Começar tutorial' : 'Aceitar desafio' : `Conclua a etapa ${item.id - 1}`}{unlocked && <ArrowRight aria-hidden="true" size={15} />}</Button></article>
          })}</div>{pageCount > 1 && <div className="level-pagination"><Button variant="outline" size="sm" disabled={currentPage === 0} aria-label="Etapas anteriores" onClick={() => setLevelPage(currentPage - 1)}><ChevronLeft aria-hidden="true" size={17} /></Button><span>Página {currentPage + 1} de {pageCount}</span><Button variant="outline" size="sm" disabled={currentPage === pageCount - 1} aria-label="Mais etapas" onClick={() => setLevelPage(currentPage + 1)}><ChevronRight aria-hidden="true" size={17} /></Button></div>}</div>
        </section>}
        {screen === 'game' && <section className="game-screen">
          <div className="mission-heading">
            <Button variant="ghost" className="phase-back" aria-label="Voltar para a trilha" onClick={() => navigate('levels')}><ChevronLeft aria-hidden="true" size={20} /><span>Fases</span></Button>
            <div className="phase-title"><span className="eyebrow">FASE {String(level.id).padStart(2, '0')} / {levels.length} · {level.module === 'tutorial' ? 'TUTORIAL' : level.module === 'practice' ? 'NA PRÁTICA' : 'DESAFIO'}</span><h1 tabIndex={-1}>{level.name}</h1></div>
            <p className="phase-objective" aria-label="Objetivo da fase">{level.instruction}</p>
            <Button ref={helpButtonRef} variant="outline" aria-label="Ajuda da fase" aria-haspopup="dialog" onClick={() => setHelp('material')}><CircleHelp aria-hidden="true" size={20} /><span className="help-label">Ajuda</span></Button>
          </div>
          <PhaseHelp key={`help-${level.id}`} level={level} mode={help} onClose={() => { setHelp(null); helpButtonRef.current?.focus() }} />
          <div className="game-workspace"><div className="workbench"><CircuitEditor key={level.id} rules={level} initialDraft={drafts[level.id]} onDraftChange={draft => { setDrafts(current => ({ ...current, [level.id]: draft })); setResult(null) }} onTest={circuit => {
            const validation = validateSolution(circuit, level)
            setResult(validation)
            if (validation.status === 'passed') { updateProgress({ ...progress, completed: [...new Set([...completed, level.id])].sort((a, b) => a - b) }); setScreen('success') }
          }} />{result && <div className="feedback-overlay"><button className="close-button" aria-label="Fechar resultado" onClick={() => setResult(null)}><X aria-hidden="true" size={17} /></button><ValidationFeedback result={result} inputs={level.inputs} gateLabels={gateLabels} /></div>}</div></div>
        </section>}
        {screen === 'success' && result && <section className="success-screen"><div className="success-copy"><span className="success-mark"><Check aria-hidden="true" size={32} /></span><span className="eyebrow">ETAPA {String(level.id).padStart(2, '0')} CONCLUÍDA</span><h1 tabIndex={-1}>{level.id === levels.length ? 'Sua lógica foi mais longe!' : level.id === 4 ? 'Fundamentos conectados!' : 'Conexão feita. Ideia aprendida!'}</h1><p>{level.success}</p><div className="success-takeaway"><BookOpen aria-hidden="true" size={20} /><div><strong>Leve esta ideia com você</strong><p>{level.answer}</p></div></div><div className="home-actions">{level.id < levels.length && <Button onClick={() => openLevel(level.id + 1)}>Próxima fase<ArrowRight aria-hidden="true" size={17} /></Button>}<Button variant="outline" onClick={() => navigate('levels')}>Selecionar fase</Button><Button variant="ghost" onClick={() => openLevel(level.id)}>Revisitar circuito</Button></div></div><div className="success-validation"><ValidationFeedback result={result} inputs={level.inputs} gateLabels={gateLabels} /></div></section>}
        {screen === 'guide' && <section className={`guide-screen mobile-guide-${guideMode}`}><div className="page-heading"><div><h1 tabIndex={-1}>Lógica faz sentido.</h1><p>Um guia para entender. Um espaço para experimentar.</p></div></div><div className="guide-mobile-tabs" role="group" aria-label="Área do guia"><button aria-pressed={guideMode === 'concepts'} onClick={() => setGuideMode('concepts')}><BookOpen aria-hidden="true" size={15} />Ler conceitos</button><button aria-pressed={guideMode === 'explore'} onClick={() => setGuideMode('explore')}><FlaskConical aria-hidden="true" size={15} />Experimentar portas</button></div><div className="guide-layout"><GuideBook /><div className="guide-playground"><div><h2>O que acontece se…?</h2><p>Escolha uma porta e mude suas entradas.</p></div><GateExplorer /><Button onClick={() => openLevel(activeId)}>Levar para a bancada<ArrowRight aria-hidden="true" size={16} /></Button></div></div></section>}
      </main>
    </div>
    {confirmReset && <div className="dialog-backdrop"><section role="alertdialog" aria-modal="true" aria-labelledby="reset-title" aria-describedby="reset-description" className="confirm-dialog" onKeyDown={event => { if (event.key === 'Escape') setConfirmReset(false); if (event.key === 'Tab') { event.preventDefault(); const buttons = [...event.currentTarget.querySelectorAll('button')]; buttons[(buttons.indexOf(document.activeElement as HTMLButtonElement) + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length].focus() } }}><h2 id="reset-title">Começar uma nova jornada?</h2><p id="reset-description">As etapas concluídas e as montagens desta sessão serão apagadas. Para limpar apenas o circuito, use Reiniciar fase na bancada.</p><div className="home-actions"><Button autoFocus variant="outline" onClick={() => setConfirmReset(false)}>Cancelar</Button><Button variant="destructive" onClick={() => { updateProgress(initialProgress()); setDrafts({}); setResult(null); setModule('tutorial'); setScreen('home'); setConfirmReset(false) }}>Apagar progresso</Button></div></section></div>}
  </div>
}
