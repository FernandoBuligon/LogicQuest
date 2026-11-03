import type { Validation } from '../domain/validation'

export default function ValidationFeedback({ result, inputs, gateLabels = {} }: { result: Validation; inputs: string[]; gateLabels?: Record<string, string> }) {
  return <section className={`validation-panel ${result.status}`} aria-label="Resultado da validação">
    <div role="status">
      <h2>{result.status === 'invalid' ? 'Complete o circuito' : result.status === 'incorrect' ? 'Ainda falta um ajuste' : 'Todas as combinações passaram!'}</h2>
      {result.status === 'invalid' ? <ul>{result.messages.map(message => <li key={message}>{Object.entries(gateLabels).reduce((text, [technical, label]) => text.replaceAll(technical, label), message)}</li>)}</ul> : result.status === 'incorrect' ? <>
        <p>Para {inputs.map(id => `${id} = ${Number(result.mismatch.inputs[id])}`).join(', ')}, a saída calculada foi <strong>{Number(result.mismatch.actual)}</strong>, mas deveria ser <strong>{Number(result.mismatch.expected)}</strong>.</p>
        <p>Confira o caminho dos sinais e o comportamento das portas. Uma única combinação correta não basta.</p>
      </> : <p>Seu circuito foi aprovado nas {result.rows.length} combinações possíveis.</p>}
    </div>
    {result.status !== 'invalid' && <details><summary>Ver tabela-verdade testada ({result.rows.length} combinações)</summary><div className="table-scroll"><table>
      <caption>Comparação entre o objetivo e o circuito</caption>
      <thead><tr>{inputs.map(id => <th scope="col" key={id}>{id}</th>)}<th scope="col">Esperado</th><th scope="col">Calculado</th><th scope="col">Teste</th></tr></thead>
      <tbody>{result.rows.map((row, i) => <tr key={i}>{inputs.map(id => <td key={id}>{Number(row.inputs[id])}</td>)}<td>{Number(row.expected)}</td><td>{Number(row.actual)}</td><td>{row.actual === row.expected ? 'Correto' : 'Diferente'}</td></tr>)}</tbody>
    </table></div></details>}
  </section>
}
