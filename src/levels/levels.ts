import type { LevelRules } from '../domain/validation'

export type Module = 'tutorial' | 'practice' | 'challenge'
export const modules: { id: Module; name: string; label: string; description: string }[] = [
  { id: 'tutorial', name: 'Primeiras conexões', label: 'Tutoriais', description: 'Quatro experiências guiadas para entender as portas e aprender a usar a bancada.' },
  { id: 'practice', name: 'Conectando ideias', label: 'Na prática', description: 'Combine o que você aprendeu e interprete condições com mais de uma porta.' },
  { id: 'challenge', name: 'Pense como um circuito', label: 'Desafios', description: 'Cinco novos problemas: decomponha regras, compare possibilidades e crie sua solução.' },
]
export interface Level extends LevelRules {
  id: number
  module: Module
  name: string
  topic: string
  context: string
  instruction: string
  objective: string
  explanation: string
  example: string
  question: string
  answer: string
  hints: string[]
  success: string
}
export const gateLessons = {
  AND: 'AND (E): a saída é 1 somente quando as duas entradas são 1.',
  OR: 'OR (OU): a saída é 1 quando pelo menos uma entrada é 1.',
  NOT: 'NOT (NÃO): inverte o sinal. Uma entrada 0 vira 1; uma entrada 1 vira 0.',
  XOR: 'XOR (OU exclusivo): a saída é 1 quando as duas entradas são diferentes.',
}
export const levels: Level[] = [
  { id: 1, module: 'tutorial', name: 'Ativando o gerador', topic: 'A porta AND · condições simultâneas', inputs: ['A', 'B'], availableGates: ['AND'], maxGates: 1,
    context: 'O gerador do laboratório precisa de duas autorizações para ligar.',
    instruction: 'Ligue a saída somente quando A e B estiverem ligados.', objective: 'A AND B',
    explanation: 'Um circuito trabalha com dois estados: 0 (desligado ou falso) e 1 (ligado ou verdadeiro). AND significa E: todas as condições precisam ser verdadeiras. Pense em uma bicicleta elétrica que só anda com a bateria ligada E o pedal acionado.',
    example: 'A = 1 e B = 0 → saída 0. Uma autorização sozinha não basta. A = 1 e B = 1 → saída 1.',
    question: 'Por que ligar apenas A não ativa o gerador?', answer: 'Porque AND exige as duas entradas em 1. A segunda autorização também precisa estar ligada.',
    hints: ['Adicione uma porta AND na barra acima da bancada.', 'Conecte A à entrada 1 da porta e B à entrada 2. Arraste os pontos ou use “Conectar por seleção / remover fios”.', 'Conecte a saída da AND à Saída. Alterne A e B e observe: só 1 e 1 produzem 1. Depois, teste o circuito.'],
    expected: ({ A, B }) => A && B, success: 'Você aprendeu uma regra fundamental: com AND, todas as condições precisam acontecer juntas.' },
  { id: 2, module: 'tutorial', name: 'Porta de emergência', topic: 'A porta OR · caminhos alternativos', inputs: ['A', 'B'], availableGates: ['OR'], maxGates: 1,
    context: 'Qualquer um dos dois botões de emergência pode abrir a porta.',
    instruction: 'Abra a porta quando A ou B estiver ligado, inclusive os dois juntos.', objective: 'A OR B',
    explanation: 'OR significa OU inclusivo. Basta uma entrada em 1 para a saída ligar. As duas entradas em 1 também são aceitas. É como receber uma notificação por mensagem OU por e-mail: qualquer um dos canais consegue avisar você.',
    example: 'A = 0 e B = 1 → saída 1. A = 1 e B = 1 → saída 1. A saída só é 0 quando ambos são 0.',
    question: 'O que acontece quando os dois botões estão ligados?', answer: 'A porta abre. O OU inclusivo aceita uma condição verdadeira ou as duas ao mesmo tempo.',
    hints: ['Adicione OR e ligue A e B às duas entradas.', 'Ligue a saída da OR à Saída do circuito.', 'Compare 0/0 com 1/1. OR só desliga na primeira combinação.'],
    expected: ({ A, B }) => A || B, success: 'Com OR, você criou caminhos alternativos: qualquer autorização já é suficiente.' },
  { id: 3, module: 'tutorial', name: 'Alarme invertido', topic: 'A porta NOT · negação', inputs: ['A'], availableGates: ['NOT'], maxGates: 1,
    context: 'O alarme precisa avisar quando o sensor de segurança estiver desligado.',
    instruction: 'Faça a saída ser sempre o oposto de A.', objective: 'NOT A',
    explanation: 'NOT significa NÃO e tem apenas uma entrada. Ela transforma 0 em 1 e 1 em 0. A negação permite representar a ausência de uma condição: “não há segurança” é diferente de “há segurança”.',
    example: 'Sensor A = 0 → alarme 1. Sensor A = 1 → alarme 0.',
    question: 'Se duas portas NOT fossem ligadas em sequência, qual seria o resultado?', answer: 'O sinal original. A primeira inverte e a segunda desfaz a inversão: NOT (NOT A) = A.',
    hints: ['Adicione NOT. Observe que ela só tem uma entrada.', 'Conecte A à NOT e a NOT à Saída.', 'Alterne A. O número da saída deve mudar sempre para o valor oposto.'],
    expected: ({ A }) => !A, success: 'Você usou negação para detectar a ausência de um sinal. NOT sempre inverte o estado.' },
  { id: 4, module: 'tutorial', name: 'Fechadura inteligente', topic: 'A porta XOR · escolha exclusiva', inputs: ['A', 'B'], availableGates: ['XOR'], maxGates: 1,
    context: 'A fechadura aceita exatamente uma chave ativa de cada vez.',
    instruction: 'Ligue a saída quando A e B forem diferentes. Duas chaves ativas não abrem a fechadura.', objective: 'A XOR B',
    explanation: 'XOR é o OU exclusivo. A saída liga quando exatamente uma das duas entradas está em 1. A diferença para OR aparece no caso 1/1: OR liga, mas XOR desliga. XOR pode detectar diferenças entre dois sinais.',
    example: 'A/B = 0/1 ou 1/0 → saída 1. A/B = 0/0 ou 1/1 → saída 0.',
    question: 'Em qual combinação OR e XOR têm saídas diferentes?', answer: 'Quando A = 1 e B = 1. OR aceita as duas entradas ligadas; XOR exige exatamente uma.',
    hints: ['Adicione XOR e conecte as entradas A e B.', 'Ligue XOR à Saída e experimente ligar apenas uma chave.', 'Ligue as duas chaves. XOR deve desligar a saída.'],
    expected: ({ A, B }) => A !== B, success: 'Tutoriais concluídos! Você conhece AND, OR, NOT e XOR. Agora é hora de combinar essas ideias.' },
  { id: 5, module: 'practice', name: 'Circuito combinado', topic: 'Composição · resolver por partes', inputs: ['A', 'B', 'C'], availableGates: ['AND', 'OR', 'NOT'], maxGates: 3,
    context: 'A ventilação funciona com duas autorizações ou com a ausência de um bloqueio.',
    instruction: 'Ligue a saída quando A e B estiverem ligados juntos, ou quando C estiver desligado.', objective: '(A AND B) OR (NOT C)',
    explanation: 'Uma porta pode alimentar outra. Resolva primeiro cada grupo entre parênteses: uma AND calcula a autorização conjunta; uma NOT verifica a ausência do bloqueio. OR reúne os dois caminhos. Com três entradas, precisamos verificar 2³ = 8 combinações.',
    example: 'A = 0, B = 0, C = 0 → saída 1: mesmo sem as autorizações, NOT C libera a ventilação.',
    question: 'Se C estiver ligado, o que será necessário para a ventilação funcionar?', answer: 'A e B precisam estar ligados juntos. Com C = 1, NOT C é 0, então só o caminho da AND pode liberar a saída.',
    hints: ['Divida o problema em dois caminhos: A E B; NÃO C.', 'Use uma AND para A/B e uma NOT para C.', 'Una as saídas dessas duas portas com OR e ligue à Saída.'],
    expected: ({ A, B, C }) => (A && B) || !C, success: 'Você decompôs uma regra em partes e combinou três portas em um único raciocínio.' },
  { id: 6, module: 'practice', name: 'Restaurando o sistema', topic: 'Precedência · quatro tipos de porta', inputs: ['A', 'B', 'C', 'D'], availableGates: ['AND', 'OR', 'NOT', 'XOR'], maxGates: 4,
    context: 'O controle central tem uma autorização exclusiva e um caminho alternativo de liberação.',
    instruction: 'Ligue a saída quando A e B forem diferentes e C estiver ligado, ou quando D estiver desligado.', objective: '((A XOR B) AND C) OR (NOT D)',
    explanation: 'Siga os parênteses de dentro para fora: compare A/B com XOR, exija a permissão C com AND e depois inclua a alternativa NOT D com OR. Quatro entradas formam 2⁴ = 16 casos: uma solução precisa funcionar em todos.',
    example: 'A = 1, B = 1, C = 1, D = 1 → saída 0. Apesar da permissão C, as chaves iguais não passam pela XOR.',
    question: 'Se D = 0, as outras três entradas ainda podem impedir a saída?', answer: 'Não. NOT D será 1, e a OR final aceita esse caminho independentemente dos demais sinais.',
    hints: ['Comece pela comparação exclusiva de A e B.', 'Exija C com AND. Em outro caminho, inverta D com NOT.', 'Uma OR deve receber os dois caminhos e alimentar a Saída.'],
    expected: ({ A, B, C, D }) => ((A !== B) && C) || !D, success: 'Você coordenou as quatro portas. O laboratório funciona, mas cinco novos desafios esperam por você!' },
  { id: 7, module: 'challenge', name: 'Votação da turma', topic: 'Maioria · compartilhar sinais', inputs: ['A', 'B', 'C'], availableGates: ['AND', 'OR'], maxGates: 5,
    context: 'Três representantes votam em uma proposta. A maioria decide.',
    instruction: 'Aprove a proposta quando pelo menos dois dos três votos forem 1.', objective: 'Pelo menos 2 de 3 votos',
    explanation: 'Um voto sozinho não basta; qualquer dupla aprova. Liste os pares possíveis: A/B, A/C e B/C. Uma saída pode alimentar mais de uma porta, então cada voto pode participar de várias comparações. Depois, reúna as aprovações parciais.',
    example: '1/0/1 → aprovada. 0/1/0 → rejeitada. 1/1/1 → aprovada: “pelo menos dois” também inclui três.',
    question: 'Por que usar apenas A AND B não resolve a votação?', answer: 'Porque isso ignora as maiorias A/C e B/C. A proposta também deve passar quando A ou B for o voto contrário.',
    hints: ['Quais duplas podem formar a maioria? Há três pares possíveis.', 'Calcule cada par com AND. Você pode usar a mesma entrada em mais de um fio.', 'Reúna os três resultados com duas OR. Você tem cinco portas no total.'],
    expected: ({ A, B, C }) => Number(A) + Number(B) + Number(C) >= 2, success: 'Você construiu um circuito de maioria, usado em sistemas que comparam decisões para aumentar a confiabilidade.' },
  { id: 8, module: 'challenge', name: 'Roteador de sinais', topic: 'Seleção · multiplexador', inputs: ['A', 'B', 'S'], availableGates: ['AND', 'OR', 'NOT'], maxGates: 4,
    context: 'Dois sensores compartilham a mesma saída. Um seletor escolhe qual deve ser ouvido.',
    instruction: 'Quando S = 0, copie A para a saída. Quando S = 1, copie B.', objective: 'S = 0 → A · S = 1 → B',
    explanation: 'Um multiplexador escolhe um sinal entre vários. Ative o caminho de A com NOT S e o de B com S. Como S e NOT S nunca são 1 juntos, só um caminho é selecionado. Uma OR combina os caminhos sem misturá-los.',
    example: 'A = 1, B = 0, S = 0 → saída 1. Se mudar apenas S para 1, a saída vira 0 e passa a seguir B.',
    question: 'O que acontece se A e B forem iguais?', answer: 'A saída terá esse mesmo valor para qualquer S. O seletor muda a origem do sinal, mas as duas origens têm o mesmo estado.',
    hints: ['Crie dois caminhos que nunca estejam habilitados ao mesmo tempo.', 'Combine A com NOT S usando AND. Combine B com S usando outra AND.', 'Use OR para unir os dois resultados. A solução cabe em quatro portas.'],
    expected: ({ A, B, S }) => S ? B : A, success: 'Você construiu um multiplexador: o mesmo princípio permite escolher dados dentro de computadores.' },
  { id: 9, module: 'challenge', name: 'Código de paridade', topic: 'Paridade · encadear XOR', inputs: ['A', 'B', 'C', 'D'], availableGates: ['AND', 'OR', 'NOT', 'XOR'], maxGates: 3,
    context: 'Uma mensagem usa quatro bits. O verificador deve identificar uma quantidade ímpar de bits ligados.',
    instruction: 'Ligue a saída quando houver exatamente um ou três sinais em 1.', objective: 'Quantidade ímpar de entradas ligadas',
    explanation: 'XOR funciona como uma soma módulo 2: cada novo 1 inverte a paridade. Encadeando comparações, uma quantidade par de sinais ligados produz 0 e uma quantidade ímpar produz 1. Bits de paridade ajudam a detectar algumas alterações em transmissões.',
    example: '1/1/1/0 tem três bits ligados → 1. 1/1/0/0 tem dois → 0. Quatro bits ligados também produzem 0.',
    question: 'Esse verificador detecta qualquer alteração na mensagem?', answer: 'Não. Uma quantidade ímpar de bits alterados muda a paridade; uma quantidade par pode manter a mesma paridade e passar despercebida.',
    hints: ['Compare o comportamento desejado com a tabela da XOR.', 'Calcule a paridade de A/B e de C/D separadamente.', 'Compare os dois resultados com uma terceira XOR.'],
    expected: ({ A, B, C, D }) => (Number(A) + Number(B) + Number(C) + Number(D)) % 2 === 1, success: 'Você criou um verificador de paridade e também aprendeu seu limite: erros em quantidade par podem não ser detectados.' },
  { id: 10, module: 'challenge', name: 'Senhas em sintonia', topic: 'Equivalência · igualdade de dois bits', inputs: ['A', 'B', 'C', 'D'], availableGates: ['AND', 'OR', 'NOT', 'XOR'], maxGates: 4,
    context: 'A senha A/B precisa ser idêntica à referência C/D, posição por posição.',
    instruction: 'Ligue a saída somente quando A = C e B = D.', objective: 'AB = CD',
    explanation: 'XOR detecta diferença entre dois bits. Compare A com C e B com D. Se houver diferença em qualquer posição, as senhas não são iguais. Podemos reunir os erros com OR e negar o resultado, evitando uma inversão para cada par.',
    example: 'A/B = 1/0 e C/D = 1/0 → 1. A/B = 1/0 e C/D = 0/1 → 0, apesar de ambas terem um bit ligado.',
    question: 'Por que contar os bits ligados não é suficiente para comparar senhas?', answer: 'Porque a posição importa. 10 e 01 têm a mesma quantidade de bits ligados, mas representam sequências diferentes.',
    hints: ['Detecte diferenças em cada posição com duas XOR.', 'Use OR para descobrir se existe qualquer diferença.', 'Inverta a detecção de erro com NOT. Nenhuma diferença significa igualdade.'],
    expected: ({ A, B, C, D }) => A === C && B === D, success: 'Você construiu um comparador de dois bits e economizou portas negando o resultado agregado.' },
  { id: 11, module: 'challenge', name: 'Missão: estufa inteligente', topic: 'Projeto final · regras e prioridades', inputs: ['A', 'B', 'C', 'D'], availableGates: ['AND', 'OR', 'NOT', 'XOR'], maxGates: 7,
    context: 'A estufa combina sensores, modo manual e uma trava de segurança.',
    instruction: 'A = calor, B = solo seco, C = modo manual e D = trava. Com C = 0, regue se A ou B ligar. Com C = 1, regue só se A e B ligarem. D = 1 sempre impede a rega.', objective: 'Escolha o modo. Respeite a trava.',
    explanation: 'Transforme o texto em decisões menores. Sem trava, o modo automático aceita qualquer sensor; o manual exige os dois. Uma forma compacta de unir essas regras é exigir (A OU B) junto de (NÃO C OU (A E B)). A trava precisa bloquear o resultado final, independentemente do modo.',
    example: 'A = 1, B = 0, C = 0, D = 0 → rega ligada. Mudar C para 1 desliga a rega. Com D = 1, a saída é sempre 0.',
    question: 'Por que colocar a trava só em um dos caminhos pode ser perigoso?', answer: 'Porque o outro caminho ainda poderia ligar a rega. Uma condição obrigatória precisa bloquear todos os caminhos que chegam à saída.',
    hints: ['Comece pela regra automática A OU B e pela exigência manual A E B.', 'O requisito extra é NÃO C OU (A E B). Combine-o com A OU B usando AND.', 'Inverta D e exija esse sinal com uma AND final. Use as sete portas disponíveis.'],
    expected: ({ A, B, C, D }) => !D && (C ? A && B : A || B), success: 'Trilha concluída! Você interpretou um problema, decompôs condições e validou um projeto com prioridades de segurança.' },
]

export function isUnlocked(id: number, completed: number[]): boolean {
  return levels.some(level => level.id === id) && (id === 1 || Array.from({ length: id - 1 }, (_, i) => i + 1).every(previous => completed.includes(previous)))
}
