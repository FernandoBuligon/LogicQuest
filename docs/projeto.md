# Documentação do projeto — Logic Quest

## Objetivos e público

**Objetivo geral:** oferecer experimentação de lógica digital por meio da montagem e validação de circuitos combinacionais em um jogo local para navegador.

**Objetivos específicos:** reconhecer AND/OR/NOT/XOR; relacionar entradas, sinais intermediários e saída; combinar portas; verificar soluções pela tabela-verdade completa; aprender com contraexemplos; avançar por seis desafios progressivos.

**Público-alvo proposto:** estudantes iniciantes em lógica digital, informática ou eletrônica, com apoio opcional de um docente. **Lacuna de aprendizagem proposta:** memorizar tabelas sem compreender o comportamento de circuitos compostos. Essa hipótese motivou o projeto, mas não foi confirmada por pesquisa de campo nem avaliação de aprendizagem.

## Requisitos funcionais implementados

| ID | Requisito | Caso de uso / evidência |
|---|---|---|
| RF001 | Exibir menu, seleção de fases e tela de jogo. | CDU001, teste de abertura e percurso completo. |
| RF002 | Oferecer seis fases com instrução, entradas fixas, portas disponíveis e limite. | CDU001, testes das seis soluções de referência. |
| RF003 | Adicionar, mover e excluir portas AND/OR/NOT/XOR; excluir seus fios em cascata. | CDU002, testes de modelo e arraste/exclusão no navegador. |
| RF004 | Conectar saída a entrada livre; permitir ramificação e rejeitar handles inválidos/ciclos. | CDU002, testes estruturais, destino ocupado e ciclo no editor. |
| RF005 | Proteger entradas e saída fixas contra remoção/movimentação. | CDU002, testes de modelo/navegador. |
| RF006 | Alternar 0/1 e mostrar sinais de componentes/fios e saída; indicar desconhecido com `?`. | CDU003, tabelas-verdade e simulação AND no navegador. |
| RF007 | Validar todas as `2^n` combinações e aceitar equivalência dentro das restrições da fase. | CDU004, validador e equivalência por De Morgan. |
| RF008 | Informar erros estruturais e contraexemplo com entradas, valor esperado e calculado. | CDU004, erro proposital nas seis fases. |
| RF009 | Liberar a próxima fase após aprovação e permitir revisitar fases disponíveis. | CDU001/CDU005, progressão e percurso completo. |
| RF010 | Salvar conquistas e última fase localmente e recuperar sem quebrar com dados corrompidos. | CDU005, testes de storage e reload. |
| RF011 | Reiniciar montagem separadamente de reiniciar progresso, com confirmação para apagar conquistas. | CDU002/CDU005, testes dos dois reinícios e foco do diálogo. |
| RF012 | Preservar montagens ao navegar entre telas durante a sessão. | CDU002, teste de retorno à fase. |

## Requisitos não funcionais

| ID | Requisito | Verificação e limite |
|---|---|---|
| RNF001 | Executar localmente em navegador sem backend/serviços externos. | Build estático; seis fases concluídas com rede desligada após carregar. Instalação inicial exige internet. |
| RNF002 | Fornecer controles rotulados e indicadores compreensíveis além da cor. | 0/1/?, legendas, foco e seletores. Revisão visual em desktop/390 px; sem certificação com leitor de tela. |
| RNF003 | Simulação e validação determinísticas, sem execução de código do jogador. | Motor puro, detecção topológica de ciclos, tabelas completas e testes. |
| RNF004 | Separar regras, dados das fases, armazenamento e componentes visuais. | Módulos `domain`, `levels`, `storage`, `circuit`, `app`/`components`. |
| RNF005 | Preservar progresso após reload no mesmo perfil/origem. | Persistência versionada com tratamento de falhas. Limpeza de dados ou storage indisponível impede conservação. |

Não foram estabelecidas metas numéricas de desempenho nem comprovada melhoria de aprendizagem.

## Casos de uso

Ator principal de todos os casos: **jogador**. Um docente pode acompanhar, mas não há conta/perfil específico para ele.

### CDU001 — Selecionar fase

Precondição: jogo aberto. Fluxo: abrir seleção → consultar situação → escolher fase disponível → ler objetivo no editor. Alternativa: fase bloqueada fica desabilitada até concluir as anteriores. Pós-condição: fase acessada registrada como última fase; montagem anterior da sessão recuperada quando houver.

### CDU002 — Montar circuito

Precondição: editor de fase disponível. Fluxo: adicionar porta → posicionar → conectar handles → ajustar/remover componentes ou fios. Alternativas: usar seletores; lixeira ou Delete; limite impede adicionar; destino ocupado/ciclo/ligação inválida são recusados com orientação. Reiniciar fase limpa apenas a montagem. Pós-condição: circuito editado, respeitando componentes fixos.

### CDU003 — Simular circuito

Precondição: editor aberto. Fluxo: alternar uma entrada → motor avalia o grafo → tela mostra sinais e saída. Alternativa: sinal dependente de entrada desconectada aparece como `?`, com orientação. Pós-condição: sinais correspondem aos valores atuais; a fase não é aprovada apenas pela simulação.

### CDU004 — Validar solução

Precondição: editor aberto. Fluxo: Testar circuito → verificar estrutura/restrições → executar tabela inteira → apresentar aprovação e liberar próxima fase. Alternativas: circuito incompleto/inválido recebe instrução; circuito logicamente incorreto recebe contraexemplo e tabela comparada. Pós-condição: conquista registrada somente após aprovação completa.

### CDU005 — Consultar progresso

Precondição: jogo aberto. Fluxo: menu/seleção mostram quantidade e fases concluídas → continuar última fase ou revisitar outra disponível. Alternativas: recarregar recupera conquistas; dados inválidos voltam ao inicial; storage bloqueado mantém jogo na sessão com aviso; Reiniciar progresso exige confirmação, podendo cancelar. Pós-condição: progresso consultado ou reiniciado de forma explícita.

## Decisões técnicas

- **Aplicação local:** React/Vite/TypeScript, navegação por estado, sem biblioteca de rotas ou backend. Tailwind usa o plugin Vite; apenas Button do shadcn/ui foi necessário.
- **Motor puro:** inspeção topológica em todos os componentes, incluindo regiões fora do caminho da saída; sinais desconhecidos são `null`. Nenhum código do jogador é executado.
- **Editor:** XYFlow cuida do canvas; posições/fios são adaptados ao domínio. Medição e seleção são separadas das alterações do circuito para evitar sobrescrever montagens. Seletores usam as mesmas regras dos handles.
- **Validação:** funções booleanas das fases definem o objetivo; todas as combinações são testadas sem comparar desenhos. Portas completas fora do caminho da saída são aceitas dentro do limite; portas incompletas e ciclos são rejeitados.
- **Persistência:** conquistas/última fase são versionadas em localStorage; montagens ficam em memória na sessão. Falhas de leitura/gravação recebem fallback ou aviso.
- **Testes:** Vitest verifica o domínio; Playwright gera build e inicia preview na porta 4173, sem reaproveitar servidores desconhecidos. O diálogo de reinício mantém foco e restaura o controle após remover `inert` do fundo.

## Validação

Em 13/10/2026, `npm ci` reinstalou 218 pacotes pelo lockfile. Tipos, lint, 59 testes unitários em cinco arquivos, build e 12 testes de navegador passaram. Ambiente: Linux, Node 24.21.0, npm 11.19.0, Playwright 1.64.0/Chromium Headless Shell 156.0.8078.4.

| Área | Cobertura |
|---|---|
| Motor | Tabelas completas, composição/ramificação, sinais, ordem dos nós, handles inválidos, dependências ausentes, IDs repetidos, destino ocupado, ciclos e circuitos incompletos. |
| Validador e fases | Todas as combinações, equivalência por De Morgan, contraexemplos, restrições, seis soluções corretas/incorretas e progressão. |
| Edição e storage | Nós fixos, remoção em cascata, parsing/versionamento, última fase válida, roundtrip, reset, dados ausentes/corrompidos e storage bloqueado/cheio. |
| Navegador | Montagem por seleção e arraste, movimentação/exclusão por teclado, sinais ao vivo, reload, reinícios, foco do diálogo e navegação sem perder montagem. |
| Percurso completo | Tentativas incompletas/incorretas/corretas nas seis fases, sem rede após carregar; tabelas com 4, 4, 2, 4, 8 e 16 linhas. |
| Apresentação | Arquivo local, navegação/foco, imagem real carregada e 11 seções visíveis na impressão. |

Capturas reais: [menu](evidencias/menu.png), [fase 5](evidencias/fase-5.png), [sucesso](evidencias/sucesso-final.png), [editor em tela menor](evidencias/editor-mobile.png). Revisadas visualmente em 1280 px e 390 px. O percurso foi automatizado no navegador real; isso não comprova eficácia pedagógica nem substitui pesquisa com estudantes. Não houve ensaio em todos os navegadores ou certificação com leitor de tela.

## Termo de Abertura

O [Termo de Abertura preenchido](TERMO_DE_ABERTURA_LOGIC_QUEST.docx) usa a organização do [modelo acadêmico fornecido](<MODELO_TERMO DE ABERTURA DO PROJETO_COMPLETO.docx>), que permanece intacto. A versão preenchida substitui os exemplos de outro projeto por identificação, justificativa, requisitos, cinco casos de uso, matrizes, diagramas e capturas reais do Logic Quest.

A versão final do termo foi atualizada em 03/11/2026 para 11 etapas. Fernando Buligon é o único responsável e stakeholder; os demais dados de identificação foram omitidos por sua escolha. O termo preserva o registro documental dos 27 commits da main do repositório anterior, até `2520b71`; esses identificadores não pertencem ao novo histórico Git, e as sete capturas mostram a interface com bancada prioritária, objetivo visível e ajuda contextual.

O questionário não foi aplicado. Não há participantes, respostas, aprovação institucional ou resultados pedagógicos a declarar. Os requisitos e prioridades foram definidos pelo responsável pelo projeto.

## Apresentação do projeto

A apresentação foi atualizada em 03/11/2026 para a versão de **11 etapas**, com Fernando Buligon como único responsável e stakeholder. As seções técnicas anteriores deste arquivo preservam o registro histórico da versão de seis fases; consulte o [README atual](../README.md) e o [termo final](TERMO_DE_ABERTURA_LOGIC_QUEST.pdf) para o estado atual do produto.

- [Slides HTML](../apresentacao/slides.html): 11 slides; setas e botões navegam, Home/End vão ao início/fim e Ctrl+P imprime todas as páginas.
- [Slides em PDF](../apresentacao/slides.pdf): versão para leitura, projeção e impressão.
- [Roteiro de fala e demonstração](../apresentacao/roteiro.md): falas sugeridas, tempos, conceitos e preparação do jogo.

A sequência acadêmica apresenta ideia, contexto, justificativa, objetivos, tecnologias, desenvolvimento, funcionamento, resultados, conclusão com trabalhos futuros e agradecimentos em um slide exclusivo. Os slides usam a temática visual do Logic Quest, tópicos curtos e capturas atuais. O roteiro sugere 15 a 20 minutos de fala, com uma demonstração opcional de aproximadamente três minutos. Os resultados técnicos são os registrados em 03/11/2026.
