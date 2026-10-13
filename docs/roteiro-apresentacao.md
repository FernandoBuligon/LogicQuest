# Apresentação — 23 minutos

Abra `apresentacao/slides.html` no navegador. Setas esquerda/direita navegam; Home/End vão ao início/fim. Os botões têm rótulos e o rodapé informa a página. Para PDF, imprima pelo navegador (Ctrl+P), habilitando cores de fundo se desejado. Slides e imagens são locais.

Não incluir nomes fictícios na apresentação: inserir equipe, instituição e disciplina somente quando fornecidos. A ausência do template acadêmico e de estudo pedagógico deve ser informada.

| Slide | Duração | Conteúdo da fala |
|---|---|---|
| 1 — Logic Quest | 1 min | Apresentar produto e contexto: restaurar sistemas montando circuitos. Identificar a equipe verbalmente com dados reais. |
| 2 — Problema de aprendizagem | 2 min | Diferenciar decorar tabela de compreender composição. Mostrar AND/OR/XOR com duas entradas ativas. Explicar que a lacuna é hipótese motivadora, não resultado de entrevistas. |
| 3 — Objetivo e escopo | 2 min | Objetivo geral/específicos, público proposto, funcionalidades do MVP e exclusões. Explicar por que execução local atende à proposta. |
| 4 — Planejamento e requisitos | 2 min | Sequência das etapas e commits; apresentar RF/RNF centrais, critério de aprovação e casos de uso. Requisitos detalhados estão em `docs/requisitos.md`. |
| 5 — Design das seis fases | 2 min | Mostrar progressão: portas isoladas → circuitos de três/quatro portas. Contexto, instrução, restrições e feedback são dados declarativos. |
| 6 — Ferramentas e código | 3 min | React/Vite/TypeScript; XYFlow; Tailwind/Button/Lucide; Vitest/Playwright. Apresentar separação UI ↔ domínio ↔ persistência, sem backend, sem execução de código do jogador. |
| 7 — Simulação e validação | 2 min | Mostrar 2ⁿ, diferença entre interruptores atuais e validação completa, sinal desconhecido e equivalência. Explicar detecção topológica de ciclos e contraexemplo. |
| 8 — Problemas e soluções | 2 min | Medições de nós sobrescreviam montagem: separar metadados/circuito. Storage pode falhar: validar e avisar. Diálogo precisava restaurar foco depois de remover `inert`: teste de teclado. Downloads/servidor foram autorizados fora do sandbox. |
| 9 — Testes e evidências | 1 min | 60 unitários e 11 de navegador do jogo, build de produção, instalação pelo lockfile e percurso offline. Distinguir testes técnicos de validação com estudantes. |
| 10 — Demonstração | 5 min | Executar o [roteiro de demonstração](demonstracao.md): fase 1, erro, correção, fase 5 e progresso após reload. Abrir jogo preparado no mesmo navegador/origem. |
| 11 — Entrega e pendências | 1 min | Código, docs, evidências, slides. Limites reais: montagens na sessão, Chromium revisado, sem ensaio pedagógico. Template/dados institucionais pendentes; Termo final não gerado. |

**Total: 23 minutos**, com cinco reservados à demonstração funcional. Perguntas podem ocupar tempo adicional conforme a orientação da disciplina.
