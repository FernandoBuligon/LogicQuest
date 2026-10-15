import { chromium } from 'playwright-core'
import { writeFile } from 'node:fs/promises'

const browser = await chromium.launch({ headless: true })
const output = new URL('./', import.meta.url)
const checks = []
const viewports = [{ width: 1440, height: 900 }, { width: 1280, height: 720 }, { width: 768, height: 1024 }, { width: 390, height: 844 }, { width: 375, height: 812 }, { width: 320, height: 568 }, { width: 844, height: 390 }]
const origin = process.env.REVIEW_URL ?? 'http://127.0.0.1:5173'

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const shot = async screen => {
    await page.screenshot({ path: new URL(`${screen}-${viewport.width}.png`, output).pathname })
    checks.push({ viewport, screen, errors: [...errors], ...await page.evaluate(() => ({
      horizontal: document.documentElement.scrollWidth > innerWidth + 1,
      mainHorizontal: document.querySelector('main').scrollWidth > document.querySelector('main').clientWidth + 1,
    })) })
  }
  await page.goto(origin)
  await page.evaluate(() => document.fonts.ready)
  await shot('home')
  await page.getByRole('button', { name: 'Começar a aprender' }).click()
  await page.getByRole('button', { name: 'AND', exact: true }).click()
  await page.waitForTimeout(200)
  await shot('game')
  if (viewport.width <= 760) {
    await page.getByRole('button', { name: 'Entender a missão', exact: true }).click()
  }
  await page.getByRole('tab', { name: 'Aprender', exact: true }).click()
  await shot('learn')
  await page.getByRole('tab', { name: 'Tabela', exact: true }).click()
  await shot('truth-table')
  await page.getByRole('tab', { name: 'Missão', exact: true }).click()
  await shot('lesson')
  if (viewport.width <= 760) await page.getByRole('button', { name: 'Montar circuito', exact: true }).click()
  for (const [source, destination] of [['Entrada A', 'Porta AND 1 · entrada 1'], ['Entrada B', 'Porta AND 1 · entrada 2'], ['Porta AND 1', 'Saída · entrada 1']]) {
    if (!await page.getByLabel('Origem', { exact: true }).isVisible()) await page.getByText('Conectar por seleção / remover fios').click()
    await page.getByLabel('Origem', { exact: true }).selectOption({ label: source })
    await page.getByLabel('Destino', { exact: true }).selectOption({ label: destination })
    await page.getByRole('button', { name: 'Conectar fio', exact: true }).click()
  }
  await page.getByRole('button', { name: 'Testar circuito' }).click()
  await shot('success')
  await page.getByText('Ver tabela-verdade testada (4 combinações)').click()
  await shot('success-table')
  await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('button', { name: 'Trilha de aprendizado' }).click()
  await shot('levels')
  await page.getByRole('tab', { name: /Desafios/ }).click()
  await shot('challenges')
  await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('button', { name: 'Guia de lógica' }).click()
  await shot('guide')
  if (viewport.width <= 760) {
    await page.getByRole('button', { name: 'Experimentar portas' }).click()
    await shot('explorer')
  }
  await page.getByRole('button', { name: 'Reiniciar progresso' }).click()
  await shot('reset')
  await page.close()

  const advanced = await browser.newPage({ viewport, reducedMotion: 'reduce' })
  await advanced.addInitScript(() => localStorage.setItem('logic-quest:progress:v1', JSON.stringify({ version: 1, completed: [1, 2, 3, 4, 5], lastLevel: 6 })))
  await advanced.goto(origin)
  await advanced.getByRole('button', { name: 'Continuar aprendizado' }).click()
  for (const kind of ['AND', 'OR', 'NOT', 'XOR']) await advanced.getByRole('button', { name: kind, exact: true }).click()
  await advanced.screenshot({ path: new URL(`advanced-${viewport.width}.png`, output).pathname })
  checks.push({ viewport, screen: 'advanced', ...await advanced.evaluate(() => ({
    mainHorizontal: document.querySelector('main').scrollWidth > document.querySelector('main').clientWidth + 1,
    toolbarHorizontal: document.querySelector('.editor-toolbar').scrollWidth > document.querySelector('.editor-toolbar').clientWidth + 1,
  })) })
  await advanced.getByRole('button', { name: 'Testar circuito' }).click()
  await advanced.screenshot({ path: new URL(`feedback-${viewport.width}.png`, output).pathname })
  await advanced.getByRole('button', { name: 'Fechar resultado' }).click()
  await advanced.getByText('Conectar por seleção / remover fios').click()
  await advanced.getByLabel('Origem', { exact: true }).focus()
  await advanced.keyboard.press('Escape')
  checks.push({ viewport, screen: 'connection-keyboard', closed: !(await advanced.locator('.connection-tools').evaluate(element => element.open)), summaryFocused: await advanced.locator('.connection-tools summary').evaluate(element => element === document.activeElement) })
  await advanced.getByRole('navigation', { name: 'Navegação principal' }).getByRole('button', { name: 'Guia de lógica' }).click()
  await advanced.getByRole('button', { name: 'Ver conceito 6' }).click()
  await advanced.evaluate(() => document.documentElement.style.fontSize = '200%')
  await advanced.screenshot({ path: new URL(`text-200-${viewport.width}.png`, output).pathname })
  checks.push({ viewport, screen: 'text200', ...await advanced.evaluate(() => ({
    mainHorizontal: document.querySelector('main').scrollWidth > document.querySelector('main').clientWidth + 1,
    horizontal: document.documentElement.scrollWidth > innerWidth + 1,
  })) })
  await advanced.close()
}
await writeFile(new URL('review-checks.json', output), JSON.stringify(checks, null, 2))
const findings = checks.filter(check => check.horizontal || check.mainHorizontal || check.toolbarHorizontal || check.closed === false || check.summaryFocused === false || check.errors?.length)
console.log(JSON.stringify(findings))
if (findings.length) process.exitCode = 1
await browser.close()
