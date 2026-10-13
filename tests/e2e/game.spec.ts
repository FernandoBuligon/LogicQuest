import { test, expect, type Page } from '@playwright/test'
import { PROGRESS_KEY } from '../../src/storage/progress'

test.beforeEach(async ({ page }) => {
  page.on('pageerror', error => { throw error })
})

async function openEditor(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Iniciar missão' }).click()
}
async function connect(page: Page, source: string, target: string) {
  const tools = page.getByText('Conectar por seleção / remover fios')
  if (!await page.getByLabel('Origem', { exact: true }).isVisible()) await tools.click()
  await page.getByLabel('Origem', { exact: true }).selectOption({ label: source })
  await page.getByLabel('Destino', { exact: true }).selectOption({ label: target })
  await page.getByRole('button', { name: 'Conectar fio', exact: true }).click()
}

test('abre a aplicação no navegador', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Logic Quest' })).toBeVisible()
  await page.screenshot({ path: '/tmp/logicquest-home-desktop.png', fullPage: true })
})

test('permite montar em tela menor com controles rotulados', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openEditor(page)
  await page.getByRole('button', { name: 'AND', exact: true }).click()
  await connect(page, 'Entrada A', 'Porta AND 1 · entrada 1')
  await expect(page.getByRole('status')).toContainText('Fio conectado')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: '/tmp/logicquest-editor-mobile.png', fullPage: true })
})

test('monta AND, alterna sinais, rejeita entrada ocupada e remove fios com a porta', async ({ page }) => {
  await openEditor(page)
  await page.getByRole('button', { name: 'AND', exact: true }).click()
  await connect(page, 'Entrada A', 'Porta AND 1 · entrada 1')
  await connect(page, 'Entrada B', 'Porta AND 1 · entrada 2')
  await connect(page, 'Porta AND 1', 'Saída · entrada 1')
  await expect(page.getByTestId('output-value')).toHaveText('0')
  await page.getByRole('button', { name: 'Alternar entrada A' }).click()
  await expect(page.getByTestId('output-value')).toHaveText('0')
  await page.getByRole('button', { name: 'Alternar entrada B' }).click()
  await expect(page.getByTestId('output-value')).toHaveText('1')
  await connect(page, 'Entrada B', 'Porta AND 1 · entrada 1')
  await expect(page.getByRole('status')).toContainText('já tem um fio')
  await page.getByRole('button', { name: 'Remover porta AND' }).click()
  await expect(page.getByTestId('output-value')).toHaveText('?')
  await expect(page.getByText('Nenhum fio conectado.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Alternar entrada A' })).toBeVisible()
})

test('recusa ciclos e reinicia o circuito', async ({ page }) => {
  await openEditor(page)
  await page.getByRole('button', { name: 'AND', exact: true }).click()
  await connect(page, 'Porta AND 1', 'Porta AND 1 · entrada 1')
  await expect(page.getByRole('status')).toContainText('ciclo')
  await expect(page.getByText('Nenhum fio conectado.')).toBeVisible()
  await page.getByRole('button', { name: 'Reiniciar fase' }).click()
  await expect(page.getByRole('button', { name: 'Remover porta AND' })).toHaveCount(0)
})

test('valida todas as combinações antes de liberar a fase seguinte', async ({ page }) => {
  await openEditor(page)
  await connect(page, 'Entrada A', 'Saída · entrada 1')
  await page.getByRole('button', { name: 'Testar circuito' }).click()
  await expect(page.getByRole('heading', { name: 'Ainda falta um ajuste' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Resultado da validação' })).toContainText('A = 1, B = 0')
  await page.getByRole('button', { name: 'Reiniciar fase' }).click()
  await page.getByRole('button', { name: 'AND', exact: true }).click()
  await connect(page, 'Entrada A', 'Porta AND 1 · entrada 1')
  await connect(page, 'Entrada B', 'Porta AND 1 · entrada 2')
  await connect(page, 'Porta AND 1', 'Saída · entrada 1')
  await page.getByRole('button', { name: 'Testar circuito' }).click()
  await expect(page.getByRole('heading', { name: 'Missão cumprida!' })).toBeVisible()
  await expect(page.getByText('Seu circuito foi aprovado nas 4 combinações possíveis.')).toBeVisible()
  await page.getByRole('button', { name: 'Próxima fase' }).click()
  await expect(page.getByRole('heading', { name: 'Porta de emergência', exact: true })).toBeVisible()
})

test('recupera progresso e última fase; reinícios têm efeitos separados', async ({ page }) => {
  await openEditor(page)
  await page.getByRole('button', { name: 'AND', exact: true }).click()
  await connect(page, 'Entrada A', 'Porta AND 1 · entrada 1')
  await connect(page, 'Entrada B', 'Porta AND 1 · entrada 2')
  await connect(page, 'Porta AND 1', 'Saída · entrada 1')
  await page.getByRole('button', { name: 'Testar circuito' }).click()
  await page.getByRole('button', { name: 'Próxima fase' }).click()
  await page.reload()
  await expect(page.getByText('1 / 6 sistemas restaurados')).toBeVisible()
  await page.getByRole('button', { name: 'Continuar missão' }).click()
  await expect(page.getByRole('heading', { name: 'Porta de emergência', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'OR', exact: true }).click()
  await page.getByRole('button', { name: 'Reiniciar fase' }).click()
  await expect(page.getByRole('button', { name: 'Remover porta OR' })).toHaveCount(0)
  await expect(page.getByText('1 / 6 sistemas restaurados')).toBeVisible()
  await page.getByRole('button', { name: 'Logic Quest — menu inicial' }).click()
  await page.getByRole('button', { name: 'Reiniciar progresso' }).click()
  await expect(page.getByRole('alertdialog')).toBeVisible()
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click()
  await expect(page.getByText('1 / 6 sistemas restaurados')).toBeVisible()
  await page.getByRole('button', { name: 'Reiniciar progresso' }).click()
  await page.getByRole('button', { name: 'Apagar progresso' }).click()
  await expect(page.getByText('0 / 6 sistemas restaurados')).toBeVisible()
  await page.reload()
  await page.getByRole('button', { name: 'Selecionar fase', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Jogar fase 2', exact: true })).toBeDisabled()
})

test('preserva montagem ao sair e voltar à fase', async ({ page }) => {
  await openEditor(page)
  await page.getByRole('button', { name: 'AND', exact: true }).click()
  await connect(page, 'Entrada A', 'Porta AND 1 · entrada 1')
  await page.getByRole('button', { name: 'Voltar', exact: true }).click()
  await page.getByRole('button', { name: 'Jogar fase 1', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Remover porta AND' })).toBeVisible()
  await page.getByText('Conectar por seleção / remover fios').click()
  await expect(page.getByRole('button', { name: 'Remover fio 1', exact: true })).toBeVisible()
})

test('recupera dados corrompidos e permite jogar com armazenamento bloqueado', async ({ page }) => {
  await page.addInitScript(key => { try { localStorage.setItem(key, '{bad') } catch { /* Segundo reload bloqueia storage deliberadamente. */ } }, PROGRESS_KEY)
  await page.goto('/')
  await expect(page.getByText('0 / 6 sistemas restaurados')).toBeVisible()
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('bloqueado') }
    Storage.prototype.setItem = () => { throw new Error('bloqueado') }
  })
  await page.reload()
  await expect(page.getByText(/O navegador não permite salvar o progresso/)).toBeVisible()
  await page.getByRole('button', { name: 'Iniciar missão' }).click()
  await page.getByRole('button', { name: 'AND', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Remover porta AND' })).toBeVisible()
})

test('restaura as seis fases no build de produção, com erros e acertos, sem rede', async ({ page, context }) => {
  test.setTimeout(60000)
  await openEditor(page)
  await context.setOffline(true)
  const solutions = [
    { gates: ['AND'], wires: [['Entrada A', 'Porta AND 1 · entrada 1'], ['Entrada B', 'Porta AND 1 · entrada 2'], ['Porta AND 1', 'Saída · entrada 1']] },
    { gates: ['OR'], wires: [['Entrada A', 'Porta OR 1 · entrada 1'], ['Entrada B', 'Porta OR 1 · entrada 2'], ['Porta OR 1', 'Saída · entrada 1']] },
    { gates: ['NOT'], wires: [['Entrada A', 'Porta NOT 1 · entrada 1'], ['Porta NOT 1', 'Saída · entrada 1']] },
    { gates: ['XOR'], wires: [['Entrada A', 'Porta XOR 1 · entrada 1'], ['Entrada B', 'Porta XOR 1 · entrada 2'], ['Porta XOR 1', 'Saída · entrada 1']] },
    { gates: ['AND', 'NOT', 'OR'], wires: [['Entrada A', 'Porta AND 1 · entrada 1'], ['Entrada B', 'Porta AND 1 · entrada 2'], ['Entrada C', 'Porta NOT 2 · entrada 1'], ['Porta AND 1', 'Porta OR 3 · entrada 1'], ['Porta NOT 2', 'Porta OR 3 · entrada 2'], ['Porta OR 3', 'Saída · entrada 1']] },
    { gates: ['XOR', 'AND', 'NOT', 'OR'], wires: [['Entrada A', 'Porta XOR 1 · entrada 1'], ['Entrada B', 'Porta XOR 1 · entrada 2'], ['Porta XOR 1', 'Porta AND 2 · entrada 1'], ['Entrada C', 'Porta AND 2 · entrada 2'], ['Entrada D', 'Porta NOT 3 · entrada 1'], ['Porta AND 2', 'Porta OR 4 · entrada 1'], ['Porta NOT 3', 'Porta OR 4 · entrada 2'], ['Porta OR 4', 'Saída · entrada 1']] },
  ]
  const counts = [4, 4, 2, 4, 8, 16]
  for (const [i, solution] of solutions.entries()) {
    await page.getByRole('button', { name: 'Testar circuito' }).click()
    await expect(page.getByRole('heading', { name: 'Complete o circuito' })).toBeVisible()
    await connect(page, 'Entrada A', 'Saída · entrada 1')
    await page.getByRole('button', { name: 'Testar circuito' }).click()
    await expect(page.getByRole('heading', { name: 'Ainda falta um ajuste' })).toBeVisible()
    await page.getByRole('button', { name: 'Reiniciar fase' }).click()
    for (const gate of solution.gates) await page.getByRole('button', { name: gate, exact: true }).click()
    for (const [source, destination] of solution.wires) await connect(page, source, destination)
    if (i === 4) await page.screenshot({ path: '/tmp/logicquest-fase-5.png', fullPage: true })
    await page.getByRole('button', { name: 'Testar circuito' }).click()
    await expect(page.getByText(`Seu circuito foi aprovado nas ${counts[i]} combinações possíveis.`)).toBeVisible()
    await page.getByText(`Ver tabela-verdade testada (${counts[i]} combinações)`).click()
    await expect(page.locator('tbody tr')).toHaveCount(counts[i])
    await expect(page.getByText(`${i + 1} / 6 sistemas restaurados`)).toBeVisible()
    if (i < 5) await page.getByRole('button', { name: 'Próxima fase' }).click()
  }
  await expect(page.getByRole('heading', { name: 'Laboratório restaurado!' })).toBeVisible()
  await page.screenshot({ path: '/tmp/logicquest-sucesso-final.png', fullPage: true })
})

test('conecta handles por arraste, move portas e protege nós fixos', async ({ page }) => {
  await openEditor(page)
  await page.getByRole('button', { name: 'AND', exact: true }).click()
  const gate = page.getByRole('group', { name: 'Porta AND', exact: true })
  async function dragHandle(source: ReturnType<Page['locator']>, target: ReturnType<Page['locator']>) {
    await page.locator('.circuit-canvas').scrollIntoViewIfNeeded()
    const a = (await source.boundingBox())!
    const b = (await target.boundingBox())!
    await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2)
    await page.mouse.down()
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 12 })
    await page.mouse.up()
  }
  await dragHandle(page.getByTestId('handle-A-out'), gate.locator('[data-handleid="in1"]'))
  await expect(page.locator('.react-flow__edge')).toHaveCount(1)
  await dragHandle(page.getByTestId('handle-B-out'), gate.locator('[data-handleid="in2"]'))
  await dragHandle(gate.locator('[data-handleid="out"]'), page.getByTestId('handle-output-in1'))
  await expect(page.getByTestId('output-value')).toHaveText('0')
  const before = await gate.getAttribute('style')
  const box = (await gate.locator('.node-body').boundingBox())!
  await page.mouse.move(box.x + 25, box.y + 12)
  await page.mouse.down()
  await page.mouse.move(box.x + 90, box.y + 80, { steps: 10 })
  await page.mouse.up()
  await expect.poll(() => gate.getAttribute('style')).not.toBe(before)
  await page.getByRole('group', { name: 'Entrada A', exact: true }).click()
  await page.keyboard.press('Delete')
  await expect(page.getByRole('button', { name: 'Alternar entrada A' })).toBeVisible()
  await gate.focus()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Delete')
  await expect(gate).toHaveCount(0)
  await expect(page.locator('.react-flow__edge')).toHaveCount(0)
  await expect(page.getByTestId('output-value')).toHaveText('?')
})

test('mantém foco na confirmação e restaura o controle ao cancelar', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Reiniciar progresso' }).click()
  await expect(page.getByRole('button', { name: 'Cancelar', exact: true })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Apagar progresso' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Cancelar', exact: true })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('alertdialog')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Reiniciar progresso' })).toBeFocused()
})
