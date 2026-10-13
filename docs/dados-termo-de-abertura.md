# Dados para o Termo de Abertura — pendente de modelo acadêmico

**Situação:** o arquivo original `.docx` não está no repositório. Este documento organiza informações sustentadas pelo produto e não substitui o Termo final no formato da instituição. O Termo final não foi gerado. Campos e ordem devem ser ajustados quando o modelo for fornecido.

## Identificação e justificativa

- **Projeto:** Logic Quest — O Laboratório de Circuitos.
- **Produto:** jogo educativo de circuitos combinacionais, local para navegador.
- **Justificativa proposta:** facilitar a passagem de tabelas-verdade isoladas à compreensão de sinais e composição de portas por experimentação. Não houve coleta de dados que confirme essa lacuna ou a eficácia da solução.
- **Objetivo geral:** permitir montar, simular e validar circuitos com AND/OR/NOT/XOR em seis desafios progressivos.
- **Objetivos específicos, público e requisitos:** [requisitos e casos de uso](requisitos.md).
- **Instituição, curso, disciplina, docente, integrantes e responsável pela entrega:** pendentes; não inferidos do histórico Git.

## Escopo e entregas verificáveis

Menu, seleção, editor com entradas/saída fixas, portas posicionáveis, fios, sinais 0/1, seis fases, validador completo, feedback, desbloqueio e progresso local. Entregas: código-fonte, lockfile, testes, build local, README, requisitos, decisões, evidências e slides HTML.

Exclusões: backend, autenticação, ranking, multiplayer, editor de fases, circuitos analógicos ou com memória, pesquisas inventadas. Aceite técnico: [checklist](checklist-aceite.md) e [testes executados](testes.md). Aceite institucional/docente: pendente de avaliação real.

## Stakeholders

| Papel proposto | Interesse/responsabilidade | Dados reais |
|---|---|---|
| Equipe autora | Implementação, documentação e demonstração. | Nomes e contatos pendentes. |
| Docente/orientador | Critérios acadêmicos e avaliação. | Nome, contato e aprovação pendentes. |
| Estudantes iniciantes | Experimentação e compreensão de lógica digital. | Participantes não recrutados; sem entrevistas ou avaliações realizadas. |
| Instituição | Recebimento da entrega acadêmica. | Nome, regras e prazos pendentes. |

## Questionário proposto — não aplicado

1. Você já estudou portas AND, OR, NOT e XOR?
2. O que acontece na saída AND quando apenas uma entrada está ligada?
3. Qual é a diferença entre OR e XOR quando as duas entradas são 1?
4. Como explicaria um circuito que combina três portas?
5. Após usar o jogo, conseguiu relacionar os sinais intermediários à saída?
6. Qual instrução ou controle foi difícil de entender?
7. O contraexemplo ajudou a corrigir uma solução incorreta? Como?

Respostas, amostra, aplicação, autorização/consentimento conforme normas da instituição e análise: **pendentes**. Não preencher esses campos com respostas simuladas nem apresentar o questionário como evidência de validação pedagógica.

## Requisitos, casos de uso e matrizes

RF001–RF012 e RNF001–RNF005 constam no [catálogo de requisitos](requisitos.md), com matriz requisito ↔ caso de uso ↔ evidência. CDU001–CDU005 descrevem seleção, montagem, simulação, validação e consulta de progresso. Adaptar IDs/seções às matrizes exatas do modelo quando disponível; não inventar estrutura ausente.

Matriz resumida de papéis:

| Atividade | Responsável proposto | Validação |
|---|---|---|
| Código e testes técnicos | Equipe autora, nomes pendentes. | Evidências técnicas no repositório. |
| Conteúdo pedagógico e critérios acadêmicos | Equipe com docente/orientador, a confirmar. | Revisão docente não realizada/registrada. |
| Uso e feedback com estudantes | Equipe e participantes, a definir. | Pesquisa não realizada. |
| Entrega do Termo final | Responsável a definir. | Template e dados institucionais pendentes. |

## Planejamento, recursos e riscos

Sequência executada: diagnóstico → ambiente → motor → editor → validação → seis fases → interface → progresso → revisão → materiais. Histórico e resultados: [execução por etapa](execucao-etapas.md). Não foram fornecidos calendário acadêmico, carga horária, orçamento, divisão entre integrantes ou datas de aprovação; permanecem pendentes.

Recursos técnicos: computador, navegador moderno, Node.js/npm para execução e ferramentas de testes. Após instalação, o jogo não requer serviços externos. Não foram medidos custos ou resultados de aprendizagem.

| Risco/limite real | Tratamento no projeto |
|---|---|
| Circuito inválido ou ciclo | Motor detecta erros e editor recusa ligações. |
| Solução parece correta numa só configuração | Validação de todas as combinações. |
| Storage bloqueado, cheio ou corrompido | Fallback seguro e aviso quando indisponível. |
| Tela pequena | Zoom, layout adaptado e conexão por seleção. |
| Eficácia educacional desconhecida | Declarar ausência de ensaio; planejar avaliação real com instituição. |

## Protótipos e pendências da entrega

Capturas da implementação final: [menu](evidencias/menu.png), [fase 5](evidencias/fase-5.png), [sucesso](evidencias/sucesso-final.png), [tela menor](evidencias/editor-mobile.png). Materiais: [slides](../apresentacao/slides.html) e [roteiro de 23 minutos](roteiro-apresentacao.md).

Pendências: modelo `.docx`; identificação institucional/equipe/docente; prazos e atribuições; dados reais de questionário se exigido; assinaturas e aprovações. As informações técnicas estão preparadas para transposição fiel ao modelo quando esses itens forem fornecidos.
