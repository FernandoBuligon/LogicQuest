# Redesign do Logic Quest

## Análise e direção visual

O redesign parte da aplicação existente com 11 etapas. Regras, conteúdo didático, desbloqueio, persistência, montagem e validação de circuitos foram preservados.

| Problema observado | Decisão aplicada |
| --- | --- |
| Vários títulos e mensagens promocionais na abertura | Uma apresentação, uma ação principal e uma indicação da próxima etapa |
| Progresso repetido na lateral e no cabeçalho | Um indicador discreto no cabeçalho |
| Badges, brilhos, cartões motivacionais e ilustração inclinada | Remoção da decoração; manutenção do simulador funcional |
| Cada porta e painel com uma cor diferente | Superfícies neutras; tipos de porta identificados pelo nome e símbolo |
| Textos de 7–11 px para acomodar todo o conteúdo | Corpo de 16 px, textos auxiliares de 12–14 px e rolagem quando necessária |
| Cartões grandes e repetidos na trilha | Lista de etapas no desktop; blocos em coluna no celular |
| Controles de zoom cobrindo interruptores | Controles horizontais no canto inferior direito |

A direção é um laboratório de estudo contemporâneo: tipografia geométrica, contraste, linguagem direta e espaço entre grupos de informação. A personalidade vem da composição e do acento terracota. Não há gradientes, animações decorativas nem dependências novas.

As skills `ui-ux-pro-max` e `frontend-design` orientaram a hierarquia, a linguagem visual e os componentes. As buscas da primeira skill confirmaram a direção minimalista; recomendações automáticas de tipografia infantil e paletas com várias cores foram descartadas por conflitarem com o público e o pedido. A revisão final usou as [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md), recuperadas durante a revisão.

## Design system

Os tokens compartilhados estão em `src/styles/global.css`; o componente `Button` usa variantes semânticas, sem cores próprias.

| Elemento | Definição |
| --- | --- |
| Fundo / superfície | `#f7f7f5` / `#ffffff` |
| Texto / texto secundário | `#262825` / `#646760` |
| Acento / fundo de seleção | `#ad462e` / `#f7ebe5` |
| Sinal ativo e confirmação | `#24664f` / `#e8f1eb`, sempre com texto ou valor |
| Erro destrutivo | `#b33232` |
| Limites de controles | `#898d82` |
| Tipografia | Manrope variável, pesos 400–800, WOFF2 local de aproximadamente 25 KB |
| Espaçamento | 4, 8, 12, 16, 24, 32 e 48 px |
| Raios | 6, 10 e 16 px |
| Interação | Estados discretos de 160 ms, foco visível, suporte a movimento reduzido |

A fonte possui licença OFL incluída em `public/fonts/OFL-Manrope.txt`. É carregada localmente com preload e `font-display: swap`; a aplicação continua independente de fontes e serviços externos em tempo de execução.

Contrastes calculados a partir das cores finais:

| Par | Razão |
| --- | --- |
| Texto principal / fundo | 13,86:1 |
| Texto secundário / fundo | 5,36:1 |
| Texto secundário / branco | 5,75:1 |
| Acento / branco | 5,69:1 |
| Acento / seleção suave | 4,87:1 |
| Sinal ativo / fundo de confirmação | 5,90:1 |
| Bordas de controles / fundo | 3,16:1 |

## Telas e evidências

Foram revisados abertura, trilha e módulos, bancada, missão, aprendizado, tabela-verdade, guia, simulador, conexão por seleção, resultado inválido e aprovação, além da confirmação de reinício.

As capturas e o verificador reproduzível estão em `artifacts/redesign/`:

- Abertura: [desktop](../artifacts/redesign/home-1440.png) e [celular](../artifacts/redesign/home-390.png).
- Trilha: [desktop](../artifacts/redesign/levels-1440.png) e [celular](../artifacts/redesign/levels-390.png).
- Bancada: [desktop](../artifacts/redesign/game-1440.png) e [celular](../artifacts/redesign/game-390.png).
- Quatro tipos de porta: [tablet](../artifacts/redesign/advanced-768.png) e [celular estreito](../artifacts/redesign/advanced-320.png).
- Guia: [desktop](../artifacts/redesign/guide-1440.png) e [celular](../artifacts/redesign/guide-375.png).
- Aprendizado: [explicação](../artifacts/redesign/learn-390.png) e [tabela](../artifacts/redesign/truth-table-390.png).
- Resultados: [aprovação](../artifacts/redesign/success-390.png) e [circuito incompleto](../artifacts/redesign/feedback-390.png).
- Acessibilidade: [texto a 200%](../artifacts/redesign/text-200-320.png) e [confirmação](../artifacts/redesign/reset-390.png).

Resoluções: 1440×900, 1280×720, 768×1024, 390×844, 375×812, 320×568 e 844×390. Os E2E também verificam 360×640. Conteúdo extenso rola; a navegação permanece fora da área rolável. No celular, aprender e montar continuam em áreas alternáveis. Os seletores e controles de entrada fora do canvas permitem trabalhar sem arraste preciso.

Para repetir as capturas, execute a aplicação com `npm run dev -- --host 127.0.0.1 --port 5173` e, em outro terminal, `node artifacts/redesign/review.mjs`, com o Chromium do Playwright instalado. `REVIEW_URL` permite apontar o verificador para um servidor de preview. O resultado estruturado fica em `artifacts/redesign/review-checks.json`; o processo retorna erro se encontrar transbordamento, erro JavaScript ou falha nas verificações de foco.

## Validação e auditoria

Resultado final: TypeScript, lint e build de produção aprovados; **71 testes unitários** e **20 testes de navegador** aprovados. Os E2E foram concluídos em duas execuções: 19 testes de interface e o teste independente que percorre as 11 etapas offline. O verificador de capturas registrou **101 verificações em sete resoluções**, sem transbordamentos ou falhas de foco nas condições verificadas.

As verificações cobrem tipos, lint, testes unitários, build de produção, E2E e revisão das capturas. A suíte funcional percorre as 11 etapas offline, recusa circuitos incorretos, verifica simulação, arraste, exclusão, preservação de montagens, armazenamento bloqueado, desbloqueio e reinício. As regressões visuais encontradas ganharam verificações de tabela expandida em 320 px, paleta com quatro portas, texto a 200% e saída do painel de conexões por teclado.

Na revisão foram corrigidos contraste dos limites dos controles, sobreposição entre entradas, posição dos controles de zoom, transbordamento da paleta e da tabela, quebra dos controles com texto ampliado, anúncio de mudanças de saída e ocultação de ícones decorativos para leitores de tela. Mensagens de erro usam nomes como “Porta AND 1”, mantendo os identificadores técnicos fora da experiência do estudante. O painel de conexões fecha com Escape, devolve o foco ao acionador e não permanece sobre outro controle ao receber foco externo. O diálogo de reinício mantém confirmação, Escape, ciclo de Tab e restauração do foco.

Achados remanescentes das Web Interface Guidelines, no formato arquivo:linha:

```text
src/app/App.tsx:23 - navegação e etapa não têm URLs próprias; estado de tela existente preservado.
src/app/App.tsx:83 - navegação existente usa botões; não permite abrir destinos em outra aba.
```

Esses itens pertencem à arquitetura de navegação preexistente. Implementar rotas e sincronização de estado com URLs ampliaria o escopo funcional deste redesign. Não foram adicionados roteador, novas telas ou dependências para resolvê-los.

A avaliação visual foi feita em Chromium emulado, incluindo movimento reduzido e ampliação de texto. Não equivale a certificação WCAG, teste em aparelhos físicos ou validação pedagógica com estudantes. O canvas continua sujeito ao zoom necessário para circuitos grandes; os controles de simulação e conexão fora do desenho permanecem disponíveis.
