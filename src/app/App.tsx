import { CircuitBoard } from 'lucide-react'
import { Button } from '../components/ui/button'
import { useState } from 'react'
import CircuitEditor from '../circuit/CircuitEditor'

export default function App() {
  const [playing, setPlaying] = useState(false)
  if (playing) return <main className="mx-auto max-w-6xl p-6"><h1 className="mb-4 text-2xl font-bold">Logic Quest · Editor de circuitos</h1><CircuitEditor rules={{ inputs: ['A', 'B'], availableGates: ['AND', 'OR', 'NOT', 'XOR'], maxGates: 4 }} onBack={() => setPlaying(false)} /></main>
  return <main className="mx-auto max-w-3xl p-8">
    <CircuitBoard size={48} className="text-cyan-300" aria-hidden="true" />
    <h1 className="mt-6 text-4xl font-bold">Logic Quest</h1>
    <p className="my-4 text-slate-300">O Laboratório de Circuitos</p>
    <Button onClick={() => setPlaying(true)}>Abrir laboratório</Button>
  </main>
}
