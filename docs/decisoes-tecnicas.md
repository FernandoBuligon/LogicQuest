# Decisões técnicas

1. **Aplicação local sem servidor de negócio.** Vite + React + TypeScript, motor puro e fases declarativas. Navegação por estado é suficiente para três telas; dispensar biblioteca de rotas.
2. **Git preservado.** Branch `feat/logic-quest`, commits por unidade validada, sem push. Planejamento fornecido permanece intacto e fora dos commits de implementação.
3. **Ambiente de execução.** Node não estava instalado no PATH; usar distribuição oficial LTS em `/tmp` para os comandos desta sessão, sem alterar instalações globais. Usuários precisam instalar Node LTS para executar o projeto.

As próximas decisões serão registradas na etapa correspondente.
