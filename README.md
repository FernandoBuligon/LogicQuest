# Logic Quest — O Laboratório de Circuitos

Jogo educativo de puzzles 2D para aprender lógica digital experimentando sinais e montando circuitos. O jogador restaura seis sistemas de um laboratório com portas AND, OR, NOT e XOR. Cada solução é verificada contra **todas** as combinações possíveis das entradas, aceitando circuitos logicamente equivalentes dentro das regras da fase.

MVP funcional, implementado conforme o planejamento fornecido. Sem backend, login, serviços remotos, fontes externas ou conexão à internet em tempo de execução.

## Executar

Pré-requisitos: Node.js 22.12+ (recomendado LTS 24) e npm.

```bash
npm ci
npm run dev
```

Abra o endereço mostrado pelo Vite (normalmente http://localhost:5173).

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

O build fica em `dist/`. `npm run preview` serve o resultado localmente, normalmente em http://localhost:4173. Para distribuir, hospede o conteúdo de `dist/` em um servidor estático. Abra pelo servidor, e não diretamente como arquivo `file://`. Dependências e navegador de testes precisam de internet apenas para a instalação.

## Como jogar

1. Clique em **Iniciar missão** ou selecione uma fase disponível. Fases futuras são liberadas em sequência.
2. Leia o objetivo e adicione uma porta pela paleta. Arraste a porta para posicioná-la.
3. Arraste do ponto de saída de um componente ao ponto de entrada de outro. Cada entrada recebe um fio; uma saída pode alimentar vários destinos. NOT tem uma entrada; as outras portas têm duas.
4. Clique em **Alternar 0 / 1** nos interruptores e observe os sinais dos componentes e fios. `?` significa sinal desconhecido porque o circuito está incompleto.
5. Clique em **Testar circuito**. O jogo verifica todas as combinações, mostra um contraexemplo em caso de erro ou aprova a fase e libera a próxima.

Para conectar com teclado ou em tela menor, abra **Conectar por seleção / remover fios**, selecione origem/destino e confirme. Para excluir, use a lixeira da porta ou selecione um fio/porta e pressione Delete/Backspace. Os componentes fixos não podem ser movidos/excluídos. Os controles do canvas ajustam o zoom e o enquadramento.

**Reiniciar fase** limpa só a montagem atual. **Reiniciar progresso**, no menu, pede confirmação antes de apagar conquistas e montagens. O progresso e a última fase acessada ficam no `localStorage` do navegador, na chave `logic-quest:progress:v1`. Montagens são mantidas ao navegar entre telas durante a sessão; recarregar a página limpa montagens. Mantenha a mesma origem (host e porta) para retomar o progresso.

## Fases

| Fase | Sistema | Objetivo | Combinações |
|---|---|---|---|
| 1 | Ativando o gerador | `A AND B` | 4 |
| 2 | Porta de emergência | `A OR B` | 4 |
| 3 | Alarme invertido | `NOT A` | 2 |
| 4 | Fechadura inteligente | `A XOR B` | 4 |
| 5 | Circuito combinado | `(A AND B) OR (NOT C)` | 8 |
| 6 | Restaurando o sistema | `((A XOR B) AND C) OR (NOT D)` | 16 |

## Testes

`npm test` executa os testes de portas, motor, validação, fases, edição e persistência. `npm run test:watch` mantém o Vitest aberto.

Para os testes de navegador:

```bash
npx playwright install chromium --only-shell
npm run test:e2e
```

Playwright gera o build e inicia um servidor de produção local na porta 4173, que deve estar livre. Em Linux, se faltarem bibliotecas do navegador, use as instruções apresentadas pelo Playwright (`npx playwright install-deps chromium`, requer permissão administrativa). Não é necessário instalar o navegador de testes para jogar.

Validação em 13/10/2026: instalação limpa pelo lockfile, tipos, lint, **60 testes unitários**, **11 testes de navegador do jogo** e build passaram. As seis fases foram concluídas no navegador com a rede desativada após o carregamento. Evidências e limites de cobertura: [testes](docs/testes.md).

## Organização e materiais

- `src/domain/`: tipos, funções booleanas, motor de grafos e validador puro, sem React/DOM.
- `src/circuit/`: editor XYFlow, nós e adaptação entre apresentação e domínio.
- `src/levels/`: seis fases declarativas e regras de desbloqueio.
- `src/storage/`: recuperação e gravação seguras do progresso versionado.
- `src/app/`, `src/components/`, `src/styles/`: telas, feedback e estilos.
- [Requisitos e casos de uso](docs/requisitos.md), [decisões técnicas](docs/decisoes-tecnicas.md) e [execução por etapa](docs/execucao-etapas.md).
- [Dados para o Termo de Abertura](docs/dados-termo-de-abertura.md): o modelo acadêmico `.docx` e dados da equipe/instituição não foram fornecidos; o Termo final não foi gerado.
- [Demonstração de cinco minutos](docs/demonstracao.md) e [roteiro de apresentação de 23 minutos](docs/roteiro-apresentacao.md).
- [Slides HTML](apresentacao/slides.html): abra o arquivo diretamente no navegador; use as setas ou os botões para navegar e Ctrl+P para imprimir. Os slides não fazem parte do build do jogo.

Stack: React 19, TypeScript 6, Vite 8, XYFlow 12, Tailwind CSS 4, Button adaptado de shadcn/ui, Lucide, Vitest e Playwright. Versões exatas em `package-lock.json`.

Limitações: circuitos combinacionais sem memória; progresso por perfil/origem, sem sincronização remota; montagens não persistem após reload; canvas exige zoom em telas pequenas (há seletores alternativos). Revisão realizada em Chromium no Linux, com layouts de 1280 px e 390 px; não há certificação de acessibilidade nem ensaio pedagógico com estudantes.
