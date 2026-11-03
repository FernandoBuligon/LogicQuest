import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import type { Level } from '../levels/levels'
import LessonPanel from './LessonPanel'
import { Button } from './ui/button'

/** The native dialog provides focus containment and makes the workbench inert. */
export default function PhaseHelp({ level, mode, onClose }: {
  level: Level
  mode: 'intro' | 'material' | null
  onClose: () => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const startButton = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (mode && !dialog.current?.open) dialog.current?.showModal()
    if (!mode && dialog.current?.open) dialog.current.close()
    if (mode === 'intro') startButton.current?.focus()
  }, [mode])
  function dismiss() { dialog.current?.close(); onClose() }
  return <dialog ref={dialog} className={`phase-help ${mode === 'intro' ? 'phase-intro' : ''}`} aria-labelledby="phase-help-title" onCancel={event => { event.preventDefault(); dismiss() }}>
    <div className="phase-help-heading">
      <button className="close-button" aria-label="Fechar ajuda" onClick={dismiss}><X aria-hidden="true" size={20} /></button>
      <span className="eyebrow">SUA MISSÃO · FASE {String(level.id).padStart(2, '0')}</span><h2 id="phase-help-title">{level.name}</h2>
    </div>
    {mode === 'intro' && <div className="phase-intro-copy">
      <p>{level.instruction}</p>
      {level.module === 'tutorial' && <p className="initial-hint">{level.hints[0]}</p>}
      <Button ref={startButton} onClick={dismiss}>Entendi, começar</Button>
    </div>}
    <div className="phase-material" hidden={mode !== 'material'}><LessonPanel level={level} /></div>
  </dialog>
}
