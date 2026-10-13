# Logic Quest — O Laboratório de Circuitos

Jogo educativo de puzzles 2D para aprender lógica digital experimentando sinais e montando circuitos. O jogador restaura seis sistemas de um laboratório com portas AND, OR, NOT e XOR. Cada solução é verificada contra **todas** as combinações possíveis das entradas, aceitando circuitos logicamente equivalentes dentro das regras da fase.

MVP funcional. Sem backend, login, serviços remotos, fontes externas ou conexão à internet em tempo de execução.

## Preparar o ambiente e executar

Execute os comandos na pasta do projeto. É necessário **Node.js 22.12+ e npm**; os exemplos usam Node 24. Você pode instalar Node diretamente ou usar um ambiente Conda. As dependências JavaScript ficam em `node_modules/`, controladas por `package-lock.json`.

### Com Conda

Com Miniconda ou Anaconda instalado, crie um ambiente próprio para o Node e execute o jogo. Veja a [documentação de ambientes Conda](https://docs.conda.io/projects/conda/en/stable/user-guide/tasks/manage-environments.html) e o [pacote Node.js do conda-forge](https://anaconda.org/conda-forge/nodejs).

```bash
conda create --name logicquest --override-channels --channel conda-forge nodejs=24
conda activate logicquest
node --version
npm --version
npm ci
npm run dev
```

Nas próximas sessões, use `conda activate logicquest` antes dos comandos npm. Para sair, pare o servidor com Ctrl+C e execute `conda deactivate`. Se o terminal solicitar inicialização do Conda, execute `conda init bash` (ou o nome do seu shell) e abra outro terminal; no Windows, pode usar o Anaconda Prompt.

### Com Node instalado diretamente

```bash
node --version
npm --version
npm ci
npm run dev
```

Abra o endereço mostrado pelo Vite (normalmente http://localhost:5173).

### Ambiente virtual Python (`venv` / `.venv`)

Se você também usa ferramentas Python, pode criar um ambiente virtual opcional. `venv` isola Python; o jogo continua usando Node/npm, que precisam estar disponíveis no terminal. Não há dependências Python a instalar para executar o Logic Quest. Referência: [venv do Python](https://docs.python.org/3/library/venv.html).

Linux/macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
node --version
npm ci
npm run dev
```

Windows (PowerShell):

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
node --version
npm ci
npm run dev
```

Para sair do `venv`, pare o servidor e execute `deactivate`. Você não precisa combinar Conda e `venv` para jogar; escolha o Conda para isolar o Node, ou use Node instalado diretamente.

### Arquivo `.env`

O jogo funciona sem arquivo `.env`: não usa credenciais, API ou backend. Se futuramente houver configuração de ambiente, o Vite permite `.env.local`, ignorado pelo Git, e expõe ao navegador as variáveis com prefixo `VITE_`. Isso é diferente de um ambiente virtual. Referência: [variáveis de ambiente do Vite](https://vite.dev/guide/env-and-mode).

## Comandos

| Comando | Uso |
|---|---|
| `npm run dev` | Servidor de desenvolvimento. |
| `npm run typecheck` | Checagem TypeScript. |
| `npm run lint` | Análise de código. |
| `npm test` | Testes unitários. |
| `npm run test:watch` | Testes em modo contínuo. |
| `npm run test:e2e` | Testes de navegador do jogo e dos slides. |
| `npm run build` | Build de produção, incluindo checagem de tipos. |
| `npm run preview` | Servir o build de produção localmente. |

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

Validação: tipos, lint, **59 testes unitários**, **12 testes de navegador** (11 do jogo e 1 dos slides) e build. As seis fases foram concluídas no navegador com a rede desativada após o carregamento. Evidências e limites de cobertura: [documentação do projeto](docs/projeto.md#validação).

## Organização e materiais

- `src/domain/`: tipos, funções booleanas, motor de grafos e validador puro, sem React/DOM.
- `src/circuit/`: editor XYFlow, nós e adaptação entre apresentação e domínio.
- `src/levels/`: seis fases declarativas e regras de desbloqueio.
- `src/storage/`: recuperação e gravação seguras do progresso versionado.
- `src/app/`, `src/components/`, `src/styles/`: telas, feedback e estilos.
- [Documentação do projeto](docs/projeto.md): objetivos, requisitos, casos de uso, decisões, validação e roteiro de apresentação.
- [Termo de Abertura preenchido](docs/TERMO_DE_ABERTURA_LOGIC_QUEST.docx): requisitos, casos de uso, matrizes, diagramas e telas do Logic Quest. Dados pessoais/institucionais e aprovações seguem pendentes. O [modelo original](<docs/MODELO_TERMO DE ABERTURA DO PROJETO_COMPLETO.docx>) foi preservado.
- [Slides HTML](apresentacao/slides.html): abra o arquivo diretamente no navegador; use as setas ou os botões para navegar e Ctrl+P para imprimir. Os slides não fazem parte do build do jogo.

Stack: React 19, TypeScript 6, Vite 8, XYFlow 12, Tailwind CSS 4, Button adaptado de shadcn/ui, Lucide, Vitest e Playwright. Versões exatas em `package-lock.json`.

Limitações: circuitos combinacionais sem memória; progresso por perfil/origem, sem sincronização remota; montagens não persistem após reload; canvas exige zoom em telas pequenas (há seletores alternativos). Revisão realizada em Chromium no Linux, com layouts de 1280 px e 390 px; não há certificação de acessibilidade nem ensaio pedagógico com estudantes.

Documentação consolidada para evitar duplicação. O planejamento inicial e os relatórios antigos estão preservados no histórico Git (`git log --oneline`); código, testes, configurações e materiais acadêmicos permanecem no repositório. `dist/` e relatórios de testes são gerados pelos comandos acima.
