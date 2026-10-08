import { test, expect } from '@playwright/test'

test('abre a aplicação no navegador', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Logic Quest' })).toBeVisible()
})
