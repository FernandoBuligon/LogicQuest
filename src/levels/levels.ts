import type { LevelRules } from '../domain/validation'

export interface Level extends LevelRules {
  id: number
  name: string
  context: string
  instruction: string
  objective: string
  success: string
}
export const gateLessons = {
  AND: 'AND (E): a saída é 1 somente quando as duas entradas são 1.',
  OR: 'OR (OU): a saída é 1 quando pelo menos uma entrada é 1.',
  NOT: 'NOT (NÃO): inverte o sinal. Uma entrada 0 vira 1; uma entrada 1 vira 0.',
  XOR: 'XOR (OU exclusivo): a saída é 1 quando as duas entradas são diferentes.',
}
export const levels: Level[] = [
  { id: 1, name: 'Ativando o gerador', inputs: ['A', 'B'], availableGates: ['AND'], maxGates: 1,
    context: 'O gerador precisa da autorização de dois interruptores para fornecer energia ao laboratório.',
    instruction: 'Ative a saída somente quando A e B estiverem ligados.', objective: 'A AND B',
    expected: ({ A, B }) => A && B, success: 'Gerador ativado! A porta AND exige que as duas condições sejam verdadeiras.' },
  { id: 2, name: 'Porta de emergência', inputs: ['A', 'B'], availableGates: ['OR'], maxGates: 1,
    context: 'Dois botões de emergência podem liberar a porta do laboratório.',
    instruction: 'Abra a porta quando A ou B estiver ligado, inclusive quando ambos estiverem ligados.', objective: 'A OR B',
    expected: ({ A, B }) => A || B, success: 'Saída de emergência restaurada! Com OR, basta uma das condições ser verdadeira.' },
  { id: 3, name: 'Alarme invertido', inputs: ['A'], availableGates: ['NOT'], maxGates: 1,
    context: 'O alarme deve avisar quando o sensor de segurança estiver desligado.',
    instruction: 'A saída deve ser o oposto de A.', objective: 'NOT A',
    expected: ({ A }) => !A, success: 'Alarme restaurado! NOT transforma 0 em 1 e 1 em 0.' },
  { id: 4, name: 'Fechadura inteligente', inputs: ['A', 'B'], availableGates: ['XOR'], maxGates: 1,
    context: 'A fechadura aceita exatamente uma chave ativa de cada vez.',
    instruction: 'Ative a saída quando A e B forem diferentes. Duas chaves ativas não abrem a fechadura.', objective: 'A XOR B',
    expected: ({ A, B }) => A !== B, success: 'Fechadura restaurada! XOR aceita uma entrada ativa, mas não as duas juntas.' },
  { id: 5, name: 'Circuito combinado', inputs: ['A', 'B', 'C'], availableGates: ['AND', 'OR', 'NOT'], maxGates: 3,
    context: 'A ventilação usa duas autorizações ou a ausência de um bloqueio.',
    instruction: 'Ative a saída quando A e B estiverem ligados juntos, ou quando C estiver desligado.', objective: '(A AND B) OR (NOT C)',
    expected: ({ A, B, C }) => (A && B) || !C, success: 'Ventilação restaurada! Você combinou AND, NOT e OR em um único circuito.' },
  { id: 6, name: 'Restaurando o sistema', inputs: ['A', 'B', 'C', 'D'], availableGates: ['AND', 'OR', 'NOT', 'XOR'], maxGates: 4,
    context: 'Restaure o controle central com a autorização exclusiva, a permissão C e a ausência do bloqueio D.',
    instruction: 'Ative a saída quando A e B forem diferentes e C estiver ligado, ou quando D estiver desligado.', objective: '((A XOR B) AND C) OR (NOT D)',
    expected: ({ A, B, C, D }) => ((A !== B) && C) || !D, success: 'Laboratório restaurado! Você usou as quatro portas e verificou todas as 16 combinações.' },
]

export function isUnlocked(id: number, completed: number[]): boolean {
  return levels.some(level => level.id === id) && (id === 1 || Array.from({ length: id - 1 }, (_, i) => i + 1).every(previous => completed.includes(previous)))
}
