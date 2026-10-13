# Requisitos e casos de uso

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

## Rastreabilidade e protótipos finais

As tabelas acima relacionam RF/RNF, casos de uso e testes. Evidências detalhadas: [testes](testes.md). Capturas reais da implementação: [menu](evidencias/menu.png), [fase 5](evidencias/fase-5.png), [sucesso final](evidencias/sucesso-final.png) e [editor em tela menor](evidencias/editor-mobile.png). São telas do produto final, não validações feitas por usuários.
