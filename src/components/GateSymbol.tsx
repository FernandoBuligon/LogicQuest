import type { GateKind } from '../domain/types'

export default function GateSymbol({ gate, size = 36 }: { gate: GateKind; size?: number }) {
  return <svg width={size} height={size * 0.72} viewBox="0 0 64 46" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" aria-hidden="true">
    {gate === 'AND' ? <><path d="M15 5h17a18 18 0 0 1 0 36H15Z" /><path d="M3 13h12M3 33h12M50 23h11" /></> : gate === 'NOT' ? <><path d="m14 5 32 18-32 18Z" /><circle cx="50" cy="23" r="4" /><path d="M3 23h11M54 23h8" /></> : <><path d="M13 5q12 18 0 36 30 0 40-18Q43 5 13 5Z" /><path d="M3 13h14M3 33h14M53 23h9" />{gate === 'XOR' && <path d="M6 5q12 18 0 36" />}</>}
  </svg>
}
