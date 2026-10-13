# Plano de trabalho para o Codex — Logic Quest

> **Instrução principal ao Codex:** implemente o projeto descrito neste arquivo, **em ordem, etapa por etapa**, sem adicionar funcionalidades fora do escopo. Leia o repositório antes de alterar qualquer coisa. Faça testes e commits semânticos ao concluir cada unidade relevante. Não entregue apenas um planejamento: desenvolva o sistema funcional.

## 1. Objetivo e limites

**Nome:** Logic Quest — O Laboratório de Circuitos.

**Problema educacional:** estudantes iniciantes podem memorizar tabelas-verdade sem compreender como as portas lógicas funcionam e se combinam em circuitos. O jogo deve ajudar o aluno a experimentar entradas, montar circuitos e verificar os resultados.

**Produto:** jogo digital de puzzle 2D, executável no navegador, em que o jogador restaura sistemas de um laboratório resolvendo circuitos lógicos.

**Escopo obrigatório (MVP):**

- Menu inicial, seleção de fases e tela de jogo.
- Seis fases com progressão de dificuldade e instruções educativas breves.
- Entradas/saída fixas em cada fase; portas lógicas adicionadas e posicionadas pelo jogador.
- Portas `AND`, `OR`, `NOT` e `XOR`.
- Conexão visual entre portas e sinais, com indicação de 0 e 1.
- Motor de simulação determinístico e separado da interface.
- Validação por tabela-verdade, testando **todas** as combinações das entradas de cada fase.
- Mensagens de erro compreensíveis, feedback educativo e liberação da fase seguinte após aprovação.
- Salvamento do progresso via `localStorage` e opção de reiniciar uma fase.
- Instruções para executar, testar e gerar a versão de produção.

**Fora do escopo:** backend, login, banco de dados remoto, ranking on-line, multiplayer, editor de fases, componentes eletrônicos analógicos, temporizadores ou circuitos com memória, narrativas complexas, animações elaboradas e dependências sem necessidade clara.

A experiência principal deve funcionar **localmente e sem conexão à internet após instalar as dependências**. Não usar serviços externos em tempo de execução.

## 2. Stack e organização

Stack preferencial:

- **Vite + React + TypeScript:** aplicação web e estrutura de componentes.
- **@xyflow/react (React Flow):** editor de nós e conexões; usar nós personalizados e handles.
- **Tailwind CSS:** estilos.
- **shadcn/ui:** apenas componentes realmente necessários (ex.: botões, diálogos, cards).
- **lucide-react:** ícones.
- **Vitest:** testes do motor e do validador.
- **localStorage:** progresso local.

Evitar adicionar bibliotecas alternativas que dupliquem essas funções. Verificar as versões e instruções atuais das bibliotecas durante a instalação; se alguma integração se mostrar desproporcional, priorizar uma solução simples e justificar o ajuste.

Estrutura sugerida (adaptar ao repositório existente, sem reorganizações supérfluas):

```text
src/
  app/                 # rotas/telas e estado de navegação simples
  components/          # componentes visuais reutilizáveis
  circuit/             # nós React Flow, handles, paleta e editor
  domain/              # tipos, portas lógicas, motor, validação
  levels/              # configuração das 6 fases
  storage/             # persistência de progresso
  styles/              # estilos globais
  tests/               # testes, se não estiverem junto dos módulos
public/                 # apenas recursos estáticos necessários
docs/                   # documentação objetiva
apresentacao/           # slides HTML simples para a entrega final
README.md
```

Manter dados, regras de negócio e UI separados. Não criar infraestrutura ou padrões arquiteturais complexos sem benefício concreto.

## 3. Regras obrigatórias de execução e Git

1. **Inspecionar antes de modificar:** verificar `README`, dependências, árvore do projeto, scripts e estado do Git. Reaproveitar o que estiver adequado.
2. **Seguir a ordem das etapas** abaixo. Não implementar funcionalidades futuras antecipadamente, salvo dependência técnica pequena e justificada.
3. **Registrar decisões importantes** em `docs/decisoes-tecnicas.md` de forma objetiva: decisão, motivo e alternativa descartada quando relevante. Não criar documentação redundante.
4. **Commits pequenos, reais e frequentes:** criar um commit ao terminar cada alteração significativa e validada; NÃO acumular a implementação inteira em um único commit nem fazer commits cosméticos desnecessários.
5. **Padrão de commits obrigatório:** seguir https://github.com/iuricode/padroes-de-commits — **emoji + tipo semântico + descrição objetiva**, por exemplo `✨ feat: implementar porta AND`. Usar `📚 docs`, `🧪 test`, `🐛 fix`, `📦 build`, `🔧 chore`, `♻️ refactor`, `💄 feat` para alterações de interface, conforme a natureza da mudança. O repositório de referência também admite `ci`, `perf`, `cleanup` e outros tipos; preferir os tipos convencionais necessários.
6. **Não fazer commits falsos:** descrever apenas mudanças efetivamente realizadas. Exibir, ao final de cada etapa, os commits criados (hash abreviado e mensagem).
7. **Não misturar mudanças sem relação:** usar `git add <caminhos específicos>`, revisar `git diff --cached` e preservar arquivos ou mudanças pré-existentes do usuário. Não fazer `git reset --hard`, rebase destrutivo, force-push ou apagar trabalho existente.
8. **Branches:** se o projeto for novo e estiver numa `main` limpa, criar uma branch de trabalho como `feat/logic-quest`. Se já houver uma branch ativa ou convenções do repositório, respeitá-las. Não criar uma branch para cada detalhe nem realizar `push`/PR sem autorização.
9. **Testar antes de avançar:** executar os testes disponíveis, checagem de tipos, lint e build de produção quando aplicável; corrigir falhas introduzidas. Se não puder executar algo, relatar exatamente o impedimento, sem afirmar que passou.
10. **Relatório por etapa:** descrever entregas, decisões, comandos/testes executados, resultado e commits. Se houver uma decisão essencial que dependa de dados não fornecidos, marcar como pendência e continuar apenas com partes que não exijam inventar informação.

Exemplos de mensagens aceitáveis:

```text
🎉 init: iniciar Logic Quest
📦 build: configurar Vite e React
🔧 chore: configurar qualidade de código
📚 docs: definir requisitos do jogo
✨ feat: implementar portas lógicas
🧪 test: cobrir tabelas verdade
✨ feat: adicionar editor de circuitos
✨ feat: validar circuitos por fase
🐛 fix: impedir conexões cíclicas
💄 feat: estilizar interface do jogo
✨ feat: salvar progresso local
📚 docs: documentar execução e testes
```

**Observação:** os exemplos são ilustrativos. Preferir a mensagem que descreve precisamente cada alteração real, sem copiar o roteiro mecanicamente.

## 4. Etapas de implementação

### Etapa 0 — Diagnóstico e definição do escopo

**Tarefas**

- Inspecionar o repositório e identificar se está vazio ou se já existe um projeto.
- Registrar um resumo do escopo e dos critérios de aceite em `docs/escopo.md`.
- Definir o modelo de jogo: entradas e saída fixas por fase; portas adicionáveis; conexão entre handles; fases definidas em dados.
- Verificar se o modelo acadêmico de Termo de Abertura está disponível no repositório. Se não estiver, deixar anotado que o arquivo precisa ser fornecido para preenchimento fiel.

**Aceite:** escopo claro, sem mudanças destrutivas, dependências planejadas e instruções de execução identificadas.

**Commit sugerido:** `📚 docs: definir escopo do jogo`.

### Etapa 1 — Inicialização e estrutura mínima

**Tarefas**

- Configurar Vite, React e TypeScript, ou reutilizar a configuração existente.
- Instalar e configurar Tailwind, XYFlow, Lucide e o conjunto mínimo de componentes shadcn/ui.
- Adicionar Vitest, checagem TypeScript e lint, com scripts `dev`, `build`, `preview`, `test` e `lint` (ajustar ao projeto se necessário).
- Criar estrutura de pastas suficiente e uma página temporária funcional com nome do jogo.
- Preparar `.gitignore` e `README.md` inicial com instalação/execução.

**Aceite:** instalação concluída, aplicação abre no navegador, build, lint e testes iniciais executam sem erro.

**Commits sugeridos:** `📦 build: configurar ambiente web`; `🔧 chore: organizar estrutura inicial`.

### Etapa 2 — Motor lógico e testes unitários

**Tarefas**

- Criar tipos explícitos para entradas, portas, conexões, handles de entrada, saída e circuitos.
- Implementar `AND`, `OR`, `NOT` e `XOR` como funções puras para valores booleanos.
- Criar um avaliador de grafos: dado um conjunto de entradas e conexões válidas, calcular o valor da saída e o sinal em cada conexão.
- Validar a quantidade de entradas exigidas: `NOT` tem uma entrada; `AND`, `OR` e `XOR` têm duas.
- Detectar e tratar: conexão incompleta, handle de destino ocupado, conexão inválida, dependência inexistente e ciclos.
- Usar ordenação topológica ou DFS com estados de visita para evitar loops; não usar `eval`, `Function` ou execução dinâmica de código do jogador.
- Criar testes para as tabelas-verdade completas das quatro portas, composição de portas e casos inválidos.

**Aceite:** o motor funciona sem React/DOM, produz resultado previsível e retorna erros legíveis, sem travar em grafos cíclicos. Todos os testes do domínio passam.

**Commits sugeridos:** `✨ feat: implementar motor lógico`; `🧪 test: validar portas e circuitos`; `🐛 fix: tratar grafos inválidos` (apenas se houver bug real).

### Etapa 3 — Editor visual de circuitos

**Tarefas**

- Montar uma única tela de jogo com React Flow.
- Implementar nós personalizados de entrada fixa, porta lógica e saída fixa.
- Permitir adicionar portas pela paleta (um clique para adicionar e arrastar o nó no canvas é suficiente; drag-and-drop da paleta é opcional).
- Permitir posicionar, conectar e remover portas; remover também os fios associados.
- Usar handles corretamente: entradas e saídas de uma porta são explícitas; cada entrada recebe no máximo uma conexão; uma saída pode alimentar mais de um destino.
- Impedir ligações inválidas e ciclos, mostrando orientação clara ao jogador.
- Permitir alternar entradas entre 0 e 1 e exibir os valores dos sinais após a simulação.
- Manter entradas e saída de fase fixas: o jogador não pode excluí-las.
- Incluir botões `Testar circuito`, `Reiniciar fase` e `Voltar`.

**Aceite:** é possível montar e editar um circuito com várias portas, sem quebrar o estado do editor ao conectar, excluir ou reiniciar. Os sinais exibidos refletem o motor lógico.

**Commits sugeridos:** `✨ feat: criar editor de circuitos`; `✨ feat: conectar portas e sinais`; `✨ feat: simular circuito no editor`.

### Etapa 4 — Validação completa por tabela-verdade

**Tarefas**

- Definir um validador independente da interface.
- Para uma fase com `n` entradas, executar automaticamente as `2^n` combinações e comparar a saída obtida com o comportamento esperado.
- Não aprovar a fase com base apenas na combinação atual dos interruptores.
- Exigir circuito completo, sem erros estruturais, respeitando portas permitidas e limite de portas da fase quando definidos.
- Aceitar circuitos **logicamente equivalentes**, mesmo que as conexões sejam diferentes das imaginadas pelo autor da fase.
- Retornar feedback útil para falhas: exibir pelo menos uma combinação que não correspondeu ao resultado esperado, além do resultado calculado.
- Criar testes para circuito correto, incorreto, equivalente, incompleto, cíclico e casos de entradas múltiplas.

**Aceite:** nenhuma fase é concluída por coincidência de uma única configuração. Validação confiável, com testes passando.

**Commits sugeridos:** `✨ feat: validar tabelas verdade`; `🧪 test: cobrir validação de fases`.

### Etapa 5 — Configurar as seis fases e a progressão

As fases devem ser declarativas, com nome, contexto, instrução pedagógica, entradas, portas disponíveis, limite razoável de portas, condição de sucesso e feedback.

| Fase | Nome | Entradas | Solução de referência / condição esperada |
|---|---|---|---|
| 1 | Ativando o gerador | A, B | `A AND B` |
| 2 | Porta de emergência | A, B | `A OR B` |
| 3 | Alarme invertido | A | `NOT A` |
| 4 | Fechadura inteligente | A, B | `A XOR B` |
| 5 | Circuito combinado | A, B, C | `(A AND B) OR (NOT C)` |
| 6 | Restaurando o sistema | A, B, C, D | `((A XOR B) AND C) OR (NOT D)` |

**Tarefas**

- Criar a configuração das seis fases sem duplicar componentes ou motor.
- Fases 1 a 4: disponibilizar preferencialmente apenas a porta ensinada, uma unidade, para tornar o objetivo claro.
- Fase 5: disponibilizar AND, OR e NOT, com até três portas simultâneas.
- Fase 6: disponibilizar AND, OR, NOT e XOR, com até quatro portas simultâneas.
- Explicar o comportamento de cada porta por meio de textos curtos antes ou durante os desafios.
- Implementar seleção de fases, bloqueio de fases futuras, desbloqueio ao concluir e tela de sucesso.
- Garantir que as fases possam ser revisitadas.

**Aceite:** as seis fases são jogáveis do começo ao fim; as soluções de referência passam na validação e exemplos incorretos falham.

**Commits sugeridos:** `✨ feat: adicionar fases iniciais`; `✨ feat: adicionar desafios combinados`; `✨ feat: implementar progressão`.

### Etapa 6 — Interface, feedback e experiência educacional

**Tarefas**

- Aplicar identidade visual consistente, inspirada em um laboratório tecnológico: paleta escura, contraste legível, detalhes em ciano/verde, fios com sinais visualmente diferenciados.
- Criar menu inicial, cards de seleção de fases, painel com instruções e barra de portas disponíveis.
- Destacar valor de entrada, estado das portas, sinal de saída e resultado da validação.
- Incluir mensagens de acerto, erro, circuito incompleto e instruções para corrigir o problema.
- Garantir controles com rótulos, foco visível e interface utilizável em desktop e tamanhos menores, sem exigir que o editor caiba perfeitamente em telas minúsculas.
- Incluir orientações de primeiros passos sobre como adicionar e conectar portas. Não criar tutoriais longos ou animações pesadas.

**Aceite:** o jogo é compreensível para alguém que nunca o abriu, sem depender de explicação verbal do desenvolvedor.

**Commits sugeridos:** `💄 feat: estilizar telas do jogo`; `✨ feat: adicionar feedback educativo`.

### Etapa 7 — Progresso local e confiabilidade

**Tarefas**

- Persistir no `localStorage` as fases concluídas e a última fase acessada, com chave/versionamento simples.
- Recuperar o progresso após recarregar a página.
- Tratar dados ausentes ou corrompidos sem quebrar o jogo; fallback para progresso inicial.
- Separar claramente `Reiniciar fase` (limpa o circuito atual) de `Reiniciar progresso` (apaga as fases concluídas, mediante confirmação).
- Revisar estados vazios, exclusão de nós, mudança de fase, conexões indevidas e reentrada no editor.
- Adicionar testes relevantes para persistência e comportamento da progressão.

**Aceite:** progresso confiável, reinicialização sem efeitos colaterais e nenhuma perda inesperada ao navegar entre as telas.

**Commits sugeridos:** `✨ feat: persistir progresso local`; `🧪 test: verificar progressão e dados`.

### Etapa 8 — Revisão geral, testes e acabamento

**Tarefas**

- Rodar checagem de tipos, lint, testes e build de produção; corrigir problemas encontrados.
- Revisar manualmente as seis fases, incluindo acertos e erros propositais.
- Verificar semântica de cada porta, ciclo, múltiplas conexões, entrada desconectada, saída desconectada, retomada do progresso e responsividade básica.
- Remover código morto, mocks temporários, logs de depuração e dependências não usadas.
- Registrar as limitações reais do MVP; não adicionar funcionalidades novas para preencher tempo.
- Preparar roteiro de demonstração de aproximadamente cinco minutos: fase 1, erro proposital, correção, fase 5 e progresso.

**Aceite:** projeto executável do zero seguindo o README, testes e build funcionando; o jogo pode ser apresentado sem ajustes manuais no código.

**Commits sugeridos:** `🧪 test: revisar cenários críticos`; `🐛 fix: corrigir falhas de integração` (se necessário); `🧹 cleanup: remover código provisório` (se necessário).

### Etapa 9 — Documentação e materiais de entrega acadêmica

**Tarefas**

- Finalizar `README.md` com: objetivo educacional, stack, pré-requisitos, instalação, execução, scripts de teste/build e instruções de uso do jogo.
- Em `docs/`, registrar objetivos geral/específicos, público-alvo e lacuna de aprendizagem, requisitos funcionais e não funcionais numerados (`RF`, `RNF`), casos de uso principais, decisões técnicas e testes executados. Usar evidências reais do sistema desenvolvido.
- Preparar conteúdo necessário ao **Termo de Abertura** segundo o modelo acadêmico fornecido. Se o arquivo `.docx` original estiver acessível no repositório, preenchê-lo preservando a organização do modelo. Se não estiver, organizar as informações em `docs/dados-termo-de-abertura.md` e listar o arquivo pendente; **não afirmar que o Termo final foi gerado**.
- O modelo contém seções de stakeholders, questionário, requisitos, casos de uso, matrizes e protótipos: preencher o que for sustentado pelo projeto e marcar pendências de dados reais. Não inventar entrevistas, questionários respondidos, contatos pessoais ou validações que não ocorreram.
- **Após concluir e testar o jogo**, preparar slides simples e objetivos em HTML em `apresentacao/slides.html`, cobrindo: objetivos, planejamento/design/código, ferramentas, problemas e soluções, testes e demonstração. Respeitar a identidade visual do sistema; evitar animações desnecessárias.
- Produzir um roteiro que acomode **ao menos 20 minutos** de apresentação, reservando cerca de cinco minutos para a demonstração funcional. Não inventar nomes dos integrantes.

**Aceite:** documentação coerente com o código; README verificável; slides HTML preparados; eventuais pendências no Termo de Abertura explicitadas caso falte o template ou dados reais.

**Commits sugeridos:** `📚 docs: documentar requisitos e uso`; `📚 docs: preparar termo de abertura`; `✨ feat: criar slides de apresentação` (somente se forem criados).

## 5. Casos de uso essenciais (base para documentação)

- `CDU001 — Selecionar fase`: escolher uma fase disponível, ver as instruções e entrar no editor.
- `CDU002 — Montar circuito`: adicionar, conectar, deslocar ou remover portas dentro das regras da fase.
- `CDU003 — Simular circuito`: escolher valores das entradas e visualizar sinais/saída.
- `CDU004 — Validar solução`: executar todas as combinações, apresentar feedback e concluir a fase se correta.
- `CDU005 — Consultar progresso`: visualizar fases concluídas e retomar o jogo.

Não criar diagramas que não correspondam às telas e regras realmente implementadas.

## 6. Requisitos não funcionais (propostas, verificar no projeto)

- **RNF001 — Execução local:** a aplicação não necessita de backend e roda em navegador moderno.
- **RNF002 — Clareza e legibilidade:** botões e indicadores de sinais devem possuir textos ou ícones compreensíveis, não apenas depender de cores.
- **RNF003 — Confiabilidade lógica:** a validação deve ser determinística e cobrir todas as combinações de entrada de cada fase.
- **RNF004 — Manutenibilidade:** portas, motor, fases e componentes visuais devem estar separados por responsabilidade.
- **RNF005 — Persistência:** o progresso sobrevive a uma atualização de página no mesmo navegador, salvo limpeza de dados locais.

Evitar metas numéricas de desempenho sem medição.

## 7. Checklist de aceite final

- [ ] Consigo instalar dependências e rodar o projeto com comandos documentados.
- [ ] Consigo abrir o jogo, escolher e acessar a primeira fase.
- [ ] Consigo adicionar, mover, conectar e remover portas.
- [ ] As portas AND, OR, NOT e XOR respeitam suas tabelas-verdade.
- [ ] Circuitos inválidos ou cíclicos não travam a aplicação.
- [ ] Posso alterar entradas e observar os sinais e a saída.
- [ ] O botão `Testar circuito` verifica todas as combinações possíveis.
- [ ] Soluções equivalentes são aceitas e soluções incorretas rejeitadas.
- [ ] As seis fases estão implementadas e têm explicação educativa.
- [ ] O progresso é salvo e recuperado corretamente.
- [ ] Testes automatizados, verificação de tipos, lint e build foram executados com resultado informado.
- [ ] README e documentação do projeto refletem a implementação real.
- [ ] O histórico Git contém commits pequenos, semânticos, com emojis e mensagens descritivas.
- [ ] Pendências sobre Termo de Abertura e slides são resolvidas ou claramente sinalizadas.

## 8. Formato do relatório do Codex após cada etapa

```text
ETAPA: [número e título]
STATUS: concluída | parcial | bloqueada
IMPLEMENTADO: [itens verificáveis]
DECISÕES: [somente decisões relevantes]
VALIDAÇÃO: [comandos, resultados e eventuais falhas]
COMMITS: [hash abreviado + mensagem]
PENDÊNCIAS: [o que falta, sem esconder falhas]
PRÓXIMA ETAPA: [número]
```

**Regra de encerramento:** somente declarar o projeto pronto após confrontar o resultado com o checklist completo. Se a ferramenta tiver limites de tempo ou contexto, registrar o estado e continuar a partir da etapa pendente, sem repetir ou descartar trabalho já concluído.
