# Redesign do LogicQuest

## Análise da experiência anterior

A revisão começou por `App.tsx`, `LessonPanel.tsx`, `CircuitEditor.tsx`, `global.css`, pelas 11 fases, pelo modelo de montagem, avaliação, validação, persistência e testes. As capturas anteriores em `artifacts/redesign/` mostravam a bancada dividindo espaço com material didático e navegação global.

| Problema | Mudança |
| --- | --- |
| Menu global, cabeçalho, título e navegação de etapas consumiam largura e altura | Modo de jogo ocupa o quadro da aplicação, com cabeçalho compacto e retorno explícito às fases |
| Material didático permanentemente ao lado do circuito | Apresentação breve ao entrar; missão, explicação e tabela acessíveis em Ajuda |
| Alternância entre aprender e montar no celular | A bancada permanece visível como tela principal; informações abrem temporariamente |
| Controles distribuídos em várias faixas | Paleta acima do canvas; conexões, simulação e ações em rodapé compacto |
| Entradas duplicadas no desktop | Interruptores no próprio circuito; controles externos de simulação aparecem no celular |
| Texto de conexão ocupava uma faixa mesmo sem necessidade | Feedback temporário sobre a borda inferior da bancada, anunciado por região viva |
| Adicionar uma porta reenquadrava todos os componentes | Zoom preservado durante a montagem; nova porta procura espaço livre próximo ao centro visível |
| Enquadramento podia diminuir demais peças em circuitos grandes | Ajuste inicial e botão de enquadramento limitados a zoom mínimo de 65%; zoom manual até 40% |
| Componentes fixos distantes e grandes no celular | Disposição inicial compacta e nós menores, mantendo nomes, sinais e pontos de conexão |

A direção mantém a identidade existente: Manrope local, superfícies neutras, acento terracota, verde reservado aos sinais e feedback funcional. A personalidade de puzzle vem da bancada dominante e da interação com peças e fios. A skill `frontend-design` orientou a hierarquia. Não foram adicionadas dependências, animações decorativas ou novas mecânicas.

## Fluxo e responsabilidades

1. Selecionar uma fase abre uma apresentação com nome, objetivo e primeira orientação nos tutoriais.
2. **Entendi, começar**, o botão de fechar ou Escape liberam a bancada.
3. O jogador adiciona portas, conecta fios, altera entradas e usa **Testar circuito**.
4. **Ajuda** abre o material existente em abas: Missão, Aprender e Tabela. Dicas continuam progressivas, e a reflexão pode revelar sua explicação.
5. Resultado incompleto ou incorreto aparece em painel fechável. Aprovação mantém a tela de conquista e a ação de próxima fase.

`App` controla a abertura da ajuda e a navegação. `PhaseHelp` apresenta um `dialog` nativo, com contenção de foco, fundo inerte, Escape e restauração do foco ao botão de ajuda. Seu cabeçalho mantém o fechamento acessível durante a rolagem. `LessonPanel` conserva conteúdo e comportamento existentes, permanecendo montado dentro da ajuda para preservar aba, dicas e reflexão.

O editor é um irmão do diálogo: abrir e fechar ajuda não o desmonta, nem altera montagem, seleção, sinais ou viewport. As montagens continuam preservadas em memória ao navegar entre telas; o progresso das fases continua salvo em localStorage. Não foi acrescentada persistência de circuitos após recarregar.

`CircuitEditor` mantém XYFlow, exclusão por teclado, movimento de portas pelas setas, arraste e conexão por seleção. O painel de conexões fica fechado até ser solicitado, fecha com Escape e devolve o foco ao acionador. A disposição compacta é aplicada ao criar ou reiniciar um circuito em tela estreita; redimensionar não reposiciona portas que o jogador já moveu.

Motor, critérios de validação, portas AND/OR/NOT/XOR, conteúdo das 11 fases, desbloqueio e armazenamento não foram alterados.

## Identidade e acessibilidade

Os tokens compartilhados continuam em `src/styles/global.css`; `Button` mantém variantes semânticas.

| Elemento | Definição |
| --- | --- |
| Fundo / superfície | `#f7f7f5` / `#ffffff` |
| Texto / texto secundário | `#262825` / `#646760` |
| Acento / seleção | `#ad462e` / `#f7ebe5` |
| Sinal ativo / confirmação | `#24664f` / `#e8f1eb`, com valor textual |
| Erro | `#b33232` |
| Bordas de controles | `#898d82` |
| Tipografia | Manrope variável local, pesos 400–800; licença em `public/fonts/OFL-Manrope.txt` |
| Interação | Alvos de controles principais de 44 px, foco visível e movimento reduzido |

Textos extensos rolam dentro da ajuda. Os controles de zoom permanecem no canto inferior direito do canvas; ferramentas de montagem ficam fora dele. No celular, os botões externos de entrada evitam depender de toques precisos em peças ampliadas/reduzidas. Os nomes acessíveis dos controles e o anúncio de alterações de saída foram preservados.

## Evidências e reprodução

As capturas atualizadas e o verificador estão em `artifacts/redesign/`:

- Bancada: [desktop](../artifacts/redesign/game-1440.png), [tablet](../artifacts/redesign/game-768.png), [celular](../artifacts/redesign/game-390.png).
- Apresentação: [desktop](../artifacts/redesign/intro-1440.png), [celular estreito](../artifacts/redesign/intro-320.png).
- Material sob demanda: [missão](../artifacts/redesign/lesson-390.png), [aprendizado](../artifacts/redesign/learn-390.png), [tabela](../artifacts/redesign/truth-table-390.png).
- Quatro portas e quatro entradas: [desktop](../artifacts/redesign/advanced-1440.png), [tablet](../artifacts/redesign/advanced-768.png), [celular](../artifacts/redesign/advanced-320.png).
- Feedback: [circuito incompleto](../artifacts/redesign/feedback-390.png), [aprovação](../artifacts/redesign/success-390.png).
- Outras telas: [início](../artifacts/redesign/home-1440.png), [fases](../artifacts/redesign/levels-390.png), [guia](../artifacts/redesign/guide-375.png), [texto a 200%](../artifacts/redesign/text-200-320.png).

Resoluções do verificador: 1440×900, 1280×720, 768×1024, 390×844, 375×812, 320×568 e 844×390. Os E2E incluem 360×640 e redimensionamento da mesma bancada entre desktop, tablet e celular.

Para reproduzir, com Node compatível com `package.json` e Chromium do Playwright instalado:

```sh
npm run dev -- --host 127.0.0.1 --port 5173
# Em outro terminal:
node artifacts/redesign/review.mjs
```

`REVIEW_URL` aponta para outro servidor. `PLAYWRIGHT_BROWSERS_PATH` pode indicar uma instalação alternativa do Chromium. O relatório é `artifacts/redesign/review-checks.json`; o processo falha ao detectar transbordamento, erro JavaScript, falha de foco nas conexões ou participação do canvas inferior a metade da tela.

## Validação e limites

Resultado final: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` e `npm run test:e2e` aprovados: **71 testes unitários e 23 testes de navegador**. O verificador visual concluiu **115 registros em sete resoluções**, sem transbordamento, erros JavaScript ou falhas de foco nas condições verificadas.

O canvas ocupa 74,1% da tela em 1440×900, 67,8% em 390×844, 53,7% em 320×568 e 52,3% em 844×390, medido sem os painéis auxiliares abertos.

A suíte mantém os 71 testes unitários e amplia os testes de navegador para 23: todas as 11 fases são resolvidas offline, com rejeição de soluções incompletas e incorretas, progressão, salvamento, armazenamento bloqueado, conexão por seleção e arraste, exclusão, reinício, navegação e acessibilidade. Novas regressões verificam foco da apresentação, ajuda reaberta sem perder circuito/sinal/zoom/dicas, proporção do canvas, redimensionamento e componentes fixos visíveis no celular.

As capturas são inspecionadas junto dos resultados automatizados; compilar sozinho não encerra a revisão. A avaliação é feita com Chromium emulado, incluindo movimento reduzido e texto ampliado. Não substitui testes em aparelhos físicos, outros navegadores ou observação com estudantes.

Circuitos maiores podem exigir deslocamento da bancada e zoom manual, especialmente no celular e em orientação horizontal. O enquadramento preserva um mínimo de legibilidade e pode deixar parte de um circuito extenso fora da área visível. Conexões e simulação externas continuam disponíveis. Ao redimensionar uma montagem existente, as posições são preservadas; o jogador pode usar Enquadrar circuito para orientar a visualização.

A navegação continua baseada no estado React existente, sem URLs por fase ou roteador. Essas mudanças ampliariam o escopo do redesign.
