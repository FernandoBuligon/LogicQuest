import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'

const concepts = [
  { title: 'Um mundo de', accent: 'zeros e uns.', content: <><p>Um <strong>bit</strong> tem dois estados: <strong>0</strong> significa desligado ou falso; <strong>1</strong>, ligado ou verdadeiro. Esses sinais representam condições e permitem que um circuito tome decisões.</p><div className="guide-bits"><span><b>0</b> Desligado</span><span><b>1</b> Ligado</span></div></> },
  { title: 'Portas que', accent: 'tomam decisões.', content: <><p>Uma <strong>porta lógica</strong> recebe sinais e aplica uma regra. AND exige as duas condições; OR aceita pelo menos uma; NOT inverte; XOR detecta entradas diferentes.</p><p>“Vou sair se terminei a tarefa E parou de chover.” Essa decisão segue a mesma regra de uma AND.</p></> },
  { title: 'Todas as', accent: 'possibilidades.', content: <><p>Uma <strong>tabela-verdade</strong> lista cada combinação das entradas e sua saída. Com n entradas, temos <strong>2ⁿ casos</strong>: uma entrada gera 2; duas geram 4; três geram 8.</p><p>Na aba <strong>Tabela</strong> de cada etapa, você pode consultar todos os resultados que seu circuito deve produzir.</p></> },
  { title: 'Um teste', accent: 'não basta.', content: <><p>Acertar uma combinação não garante uma solução. OR e XOR, por exemplo, concordam em três dos quatro casos. Só discordam quando as duas entradas são 1.</p><p>Experimente as duas portas no simulador. Na bancada, <strong>Testar circuito</strong> verifica todas as combinações e explica o primeiro erro encontrado.</p></> },
  { title: 'Divida a regra.', accent: 'Resolva por partes.', content: <><p>Em <strong>(A AND B) OR (NOT C)</strong>, calcule primeiro os grupos: uma AND reúne A/B, uma NOT inverte C e uma OR combina os resultados.</p><p>A saída de uma porta pode alimentar outra. Os parênteses ajudam você a decidir quais partes construir primeiro.</p></> },
  { title: 'Conecte', accent: 'as suas ideias.', content: <><p>Adicione portas e conecte <strong>saída → entrada</strong>. Cada entrada recebe um fio; uma saída pode alimentar vários destinos. Evite ciclos: o sinal deve seguir adiante.</p><p>No celular ou com teclado, use os seletores <strong>Origem</strong> e <strong>Destino</strong>. Alterne as entradas nos controles abaixo da bancada e observe a saída.</p></> },
]

export default function GuideBook() {
  const [page, setPage] = useState(0)
  const concept = concepts[page]
  return <article className="guide-article">
    <span className="small-label">CONCEITO {page + 1} DE {concepts.length}</span>
    <h2>{concept.title} {concept.accent}</h2>
    <div className="guide-concept" key={page} aria-live="polite">{concept.content}</div>
    <div className="guide-pagination">
      <Button variant="outline" size="sm" disabled={page === 0} aria-label="Conceito anterior" onClick={() => setPage(page - 1)}><ChevronLeft aria-hidden="true" size={17} /></Button>
      <div aria-label={`Conceito ${page + 1} de ${concepts.length}`}>{concepts.map((_, index) => <button key={index} className={page === index ? 'active' : ''} aria-label={`Ver conceito ${index + 1}`} aria-pressed={page === index} onClick={() => setPage(index)}>{index + 1}</button>)}</div>
      <Button variant="outline" size="sm" disabled={page === concepts.length - 1} aria-label="Próximo conceito" onClick={() => setPage(page + 1)}><ChevronRight aria-hidden="true" size={17} /></Button>
    </div>
  </article>
}
