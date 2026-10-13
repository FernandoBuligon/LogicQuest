import { test, expect, type Page } from '@playwright/test'

async function openEditor(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Abrir laboratório' }).click()
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
  await page.getByRole('button', { name: 'NOT', exact: true }).click()
  await connect(page, 'Porta NOT 1', 'Porta NOT 1 · entrada 1')
  await expect(page.getByRole('status')).toContainText('ciclo')
  await expect(page.getByText('Nenhum fio conectado.')).toBeVisible()
  await page.getByRole('button', { name: 'Reiniciar fase' }).click()
  await expect(page.getByRole('button', { name: 'Remover porta NOT' })).toHaveCount(0)
})
