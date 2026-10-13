# Validação e evidências — 13/10/2026

Ambiente: Linux, Node 24.21.0, npm 11.19.0, Chromium Headless Shell 156.0.8078.4 via Playwright 1.64.0. Node e navegador de testes instalados em `/tmp` nesta sessão; dependências resolvidas pelo lockfile do repositório.

## Comandos e resultados

| Comando | Resultado |
|---|---|
| `npm ci` | Instalação limpa de 218 pacotes concluída; lockfile preservado. |
| `npm run typecheck` | Passou. |
| `npm run lint` | Passou. |
| `npm test` | 60 testes passaram em 6 arquivos. |
| `npm run build` | Passou; artefatos em `dist/`. |
| `npm run test:e2e` | 11 testes do jogo passaram no Chromium, sobre build de produção. |
| `npm run test:e2e -- tests/e2e/presentation.spec.ts` | 1 teste dos slides passou: arquivo local, navegação/foco, imagem real e todas as páginas na impressão. |

O DNS do sandbox impediu downloads e a inicialização do servidor local requereu execução autorizada fora dele. Após autorizações, instalação e testes concluíram. A suíte executa build + preview; não depende do servidor de desenvolvimento.

## Cobertura unitária

- **Motor:** tabelas completas AND/OR/NOT/XOR, sinais nos fios, composição e ramificação, ordem dos nós, entradas sem valor, handles inválidos, origem/destino inexistentes, entrada ocupada, IDs repetidos, saída ausente, ciclos e circuitos incompletos.
- **Validador:** combinações sem repetição, todas as linhas mesmo com entradas não usadas, resultado correto/incorreto, equivalência por De Morgan, entradas fixas, limite/portas permitidas, ciclos e portas incompletas fora do caminho da saída.
- **Fases:** soluções de referência aprovadas e alternativas incorretas rejeitadas nas seis fases; bloqueio, desbloqueio e revisita.
- **Edição/storage:** remoção de porta com fios associados, nós fixos, parsing/versionamento, ordem/duplicatas, última fase válida, roundtrip e reset; dados ausentes/corrompidos; storage bloqueado ou cheio.

## Cenários de navegador

1. Menu abre corretamente.
2. Montagem com seletores em 390×844, sem rolagem horizontal da página.
3. AND ao vivo, alternância de entradas, destino ocupado e remoção em cascata.
4. Ciclo recusado e montagem reiniciada.
5. Coincidência de uma configuração é reprovada; circuito correto libera a fase seguinte.
6. Conquistas e última fase após reload; reinícios separados, cancelamento e confirmação.
7. Montagem preservada ao sair/voltar durante a sessão.
8. Dados corrompidos e storage bloqueado permitem continuar jogando.
9. Percurso sequencial de todas as fases com tentativa incompleta/incorreta/correta, **sem rede após carregar**; tabelas com 4, 4, 2, 4, 8 e 16 linhas aprovadas.
10. Conexão por arraste entre handles, movimentação, proteção de nós fixos e exclusão por teclado.
11. Tab fica na confirmação; Escape cancela e devolve foco ao controle.

Capturas reais foram revisadas visualmente: [menu](evidencias/menu.png), [fase 5](evidencias/fase-5.png), [sucesso](evidencias/sucesso-final.png), [tela menor](evidencias/editor-mobile.png). Capturas provêm dos testes, sem montagem gráfica dos resultados.

A suíte completa contém 12 testes de navegador (11 do jogo e 1 dos slides). Links locais da documentação e recursos da apresentação foram conferidos. Slides revisados visualmente no Chromium; o teste de impressão verifica que as 11 seções ficam visíveis e os controles são ocultados.

## Limites de evidência

Não houve estudo com estudantes, entrevistas, questionários respondidos, certificação de acessibilidade ou ensaio em todos os navegadores. O percurso das seis fases foi automatizado no navegador real; a revisão visual das capturas não equivale a seis sessões manuais nem comprova aprendizagem. Rascunhos não são persistidos após reload; conquistas pertencem ao perfil/origem e dependem de storage disponível. Não há backend nem sincronização entre dispositivos.
