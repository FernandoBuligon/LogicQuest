import { CircuitBoard } from 'lucide-react'
import { Button } from '../components/ui/button'

export default function App() {
  return <main className="mx-auto max-w-3xl p-8">
    <CircuitBoard size={48} className="text-cyan-300" aria-hidden="true" />
    <h1 className="mt-6 text-4xl font-bold">Logic Quest</h1>
    <p className="my-4 text-slate-300">O Laboratório de Circuitos</p>
    <Button disabled>Laboratório em preparação</Button>
  </main>
}
