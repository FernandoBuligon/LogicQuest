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

Dados técnicos disponíveis: nome e objetivo do projeto, público/lacuna propostos, RF001–RF012, RNF001–RNF005, CDU001–CDU005, decisões, testes e capturas. Papéis propostos: equipe autora, docente/orientador, estudantes iniciantes e instituição; nomes, contatos, calendário, atribuições, assinaturas e aprovações ainda não foram fornecidos.

Questionário proposto, **não aplicado**: conhecimento prévio das portas; diferença OR/XOR com ambas entradas ligadas; entendimento da composição; dificuldades dos controles; utilidade do contraexemplo. Não há respostas, participantes ou resultados de aprendizagem a declarar. O conteúdo técnico do Termo está preenchido; nomes, contatos, calendário, assinaturas e aprovação acadêmica estão pendentes. Prioridades e papéis são propostas técnicas, não resultados de entrevistas.

## Apresentação — 23 minutos

Abra [os slides](../apresentacao/slides.html) diretamente no navegador. Setas navegam; Home/End vão ao início/fim; Ctrl+P imprime todas as páginas. Identifique a equipe com dados reais quando disponíveis.

| Slide | Duração | Fala |
|---|---|---|
| 1 — Produto | 1 min | Contexto do laboratório e missão de restauração. |
| 2 — Aprendizagem | 2 min | Tabela versus composição; AND/OR/XOR em 11. Lacuna é hipótese, sem entrevistas. |
| 3 — Objetivo e escopo | 2 min | Público, objetivos, execução local, MVP e exclusões. |
| 4 — Planejamento/requisitos | 2 min | Etapas verificadas, commits, RF/RNF e casos de uso. |
| 5 — Seis fases | 2 min | Portas isoladas evoluem para três/quatro portas; fases são dados. |
| 6 — Ferramentas/código | 3 min | Stack e separação interface/domínio/storage; sem backend ou código do jogador. |
| 7 — Simulação/validação | 2 min | Configuração atual versus 2ⁿ; desconhecido, ciclos, equivalência e contraexemplo. |
| 8 — Problemas/soluções | 2 min | Separar medições/circuito; tratar storage; restaurar foco após remover inert. |
| 9 — Testes | 1 min | 59 unitários, 11 cenários do jogo e percurso offline; distinguir evidência técnica de aprendizagem. |
| 10 — Demonstração | 5 min | Executar roteiro abaixo. |
| 11 — Entrega/pendências | 1 min | Materiais e limites; dados pessoais/institucionais e validações reais pendentes. |

### Demonstração — cinco minutos

Antes: execute build/preview e conclua as fases 1–4 no navegador da apresentação para liberar a fase 5. Não edite o storage para simular conquistas. Use a mesma origem e deixe servidor/página abertos.

| Tempo | Ação |
|---|---|
| 0:00–0:30 | Menu e seleção; revisitar a fase 1. |
| 0:30–1:15 | A→saída: 00 parece correto; testar e mostrar erro em A=1/B=0. |
| 1:15–2:15 | Reiniciar fase; A/B→AND→saída; alternar sinais, testar e mostrar tabela aprovada. |
| 2:15–4:30 | Fase 5: A/B→AND; C→NOT; AND/NOT→OR→saída. Explicar NOT C, experimentar entradas e testar oito combinações. |
| 4:30–5:00 | Recarregar: conquistas preservadas, montagem limpa e última fase recuperada. Distinguir os dois reinícios. |

Os seletores são alternativa ao arraste no projetor/telas pequenas. O planejamento e os relatórios por etapa estão no histórico Git; não é necessário duplicá-los em arquivos atuais.
