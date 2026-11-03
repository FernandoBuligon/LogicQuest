# Logic Quest — roteiro de apresentação do projeto

**Autor:** Fernando Buligon. **Formato:** 11 slides, com aproximadamente 15 a 20 minutos de fala. A demonstração ao vivo é opcional.

Abra [os slides HTML](slides.html) no navegador ou use [o PDF](slides.pdf). No HTML, as setas e os botões navegam; Home/End levam ao início/fim. Ctrl+P imprime todos os slides.

## 1. Apresentação do projeto

“Meu nome é Fernando Buligon e desenvolvi o Logic Quest, um jogo educativo para a prática de lógica digital. A ideia é permitir que o estudante monte circuitos, altere as entradas e verifique os resultados.”

**Transição:** “Para explicar a proposta, primeiro vou apresentar o contexto.”

## 2. Contextualização geral

“A lógica digital trabalha com dois estados, representados por zero e um. As portas lógicas recebem esses valores e produzem uma saída de acordo com uma regra. Neste projeto, trabalhei com AND, OR, NOT e XOR, voltadas a estudantes iniciantes.”

**Lembrete:** AND exige as duas condições; OR aceita qualquer uma; NOT inverte; XOR identifica entradas diferentes.

**Transição:** “A partir desse conteúdo, defini a proposta do jogo.”

## 3. Justificativa e proposta

“O estudo das tabelas-verdade pode ser complementado pela montagem de circuitos. Por isso, propus uma interface em que o estudante pode experimentar, observar os sinais e resolver desafios progressivos. Essa é a motivação do projeto; ainda não realizei uma avaliação com estudantes.”

**Transição:** “Com essa proposta, estabeleci os seguintes objetivos.”

## 4. Objetivos do projeto

“O objetivo geral foi desenvolver um jogo para explorar lógica digital por meio de circuitos. Os objetivos específicos foram apresentar as quatro portas, permitir a construção e a simulação e verificar as soluções, mostrando os erros para orientar a correção.”

**Transição:** “Para implementar esses objetivos, utilizei estas tecnologias.”

## 5. Tecnologias utilizadas

“React foi usado para construir a interface, junto com TypeScript para organizar e verificar os tipos do código. Vite executa o projeto durante o desenvolvimento e gera os arquivos de distribuição. XYFlow oferece a base do editor de circuitos, e Tailwind CSS é usado na estilização. O progresso fica no armazenamento do navegador, chamado localStorage. Os testes utilizam Vitest e Playwright.”

**Lembrete:** Vitest verifica regras do código; Playwright verifica interações no navegador. Não é necessário citar versões ou detalhar bibliotecas auxiliares.

**Transição:** “Com essas ferramentas, organizei o desenvolvimento em quatro partes.”

## 6. Organização do desenvolvimento

“Comecei definindo os objetivos, os requisitos e as regras das etapas. Em seguida, implementei o motor lógico, o editor e a validação das soluções. Depois, integrei o conteúdo educativo e o progresso. Por fim, executei testes, revisei a interface e preparei a documentação. As regras ficaram separadas da parte visual para facilitar a manutenção.”

**Transição:** “Na aplicação pronta, o usuário segue este fluxo.”

## 7. Funcionamento da aplicação

“O usuário seleciona uma etapa, lê a apresentação da missão, clica em “Entendi, começar” e monta o circuito conectando entradas, portas e saída. Depois, pode alterar as entradas para simular o comportamento. Ao testar, o sistema verifica todas as combinações possíveis. Com quatro entradas, por exemplo, são dezesseis casos. Se encontrar um erro, mostra uma combinação em que a solução falha.”

**Lembrete:** A imagem mostra a etapa 5: uma AND combina A e B, uma NOT inverte C e uma OR reúne os dois caminhos. A demonstração opcional pode ser feita aqui.

**Transição:** “Esse funcionamento resultou no produto que apresento a seguir.”

## 8. Resultados: produto desenvolvido

“O produto possui onze etapas: quatro tutoriais, duas práticas e cinco desafios. Também implementei um guia com simulador de portas, o armazenamento do progresso e a adaptação da interface para computador e celular. As imagens mostram a trilha e o guia da versão desenvolvida.”

**Lembrete:** Quatro tutoriais ensinam as portas; as práticas combinam condições; os desafios abordam maioria, seleção, paridade, igualdade e uma estufa com trava de segurança.

**Transição:** “Além das funcionalidades, verifiquei o comportamento técnico do sistema.”

## 9. Resultados: verificação técnica

“Foram aprovados 71 testes unitários, além da checagem de tipos, da análise de código e da geração da versão de distribuição. As onze etapas também foram montadas e concluídas no navegador. Esses resultados sustentam o funcionamento nos cenários testados; ainda não representam uma avaliação da aprendizagem.”

**Lembrete:** Esses resultados foram registrados em 03/11/2026. Não confundir as onze etapas percorridas com uma contagem de testes automatizados de navegador.

**Transição:** “Com esses resultados, posso concluir o projeto e indicar sua continuidade.”

## 10. Conclusão e trabalhos futuros

“Foi possível desenvolver um jogo funcional para montar, simular e validar circuitos lógicos. Os objetivos de implementação foram atendidos, reunindo conteúdo educativo, desafios progressivos e retorno sobre os erros. Como trabalho futuro, proponho avaliar o uso com estudantes e investigar melhorias a partir das dificuldades observadas.”

**Lembrete:** Concluir o que foi desenvolvido e apresentar a avaliação pedagógica como continuidade. Este slide contém a conclusão e os trabalhos futuros.

**Transição:** “Com isso, encerro a apresentação do projeto.”

## 11. Agradecimentos

“Obrigado pela atenção. Fico à disposição para as perguntas.”

**Lembrete:** Este slide é exclusivo para o agradecimento. Não introduzir conteúdo novo.

## Demonstração opcional — aproximadamente três minutos

Prepare o jogo antes da apresentação:

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Abra http://127.0.0.1:4173. No slide 7, alterne para o jogo, abra a etapa 1 e feche a apresentação inicial em “Entendi, começar”:

1. Leia o objetivo: ligar a saída apenas quando A e B estiverem ligados.
2. Adicione uma AND e conecte A e B às entradas e a AND à saída. Os seletores em “Conectar por seleção / remover fios” são uma alternativa ao arraste.
3. Alterne as entradas e mostre que a saída liga apenas em 1/1.
4. Clique em “Testar circuito” e mostre a aprovação das quatro combinações.
5. Volte aos slides e continue com os resultados.

A apresentação pode ser realizada integralmente com as capturas, sem abrir o jogo. Apenas conquistas e última fase são mantidas após recarregar; a montagem deve ser refeita se a página for recarregada.
