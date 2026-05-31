import { test, expect } from '@playwright/test'

test.describe('Pengurus Routes Restructure #55', () => {
  test('/pengurus/ikaboy renders with correct heading', async ({ page }) => {
    await page.goto('/pengurus/ikaboy')
    await expect(page.locator('h1')).toContainText('PROFIL PENGURUS IKA')
    await expect(page).toHaveURL(/\/pengurus\/ikaboy/)
  })

  test('/pengurus/ikasmansaboy renders with correct heading', async ({ page }) => {
    await page.goto('/pengurus/ikasmansaboy')
    await expect(page.locator('h1')).toContainText('PENGURUS IKA SMANSA BOY')
    await expect(page).toHaveURL(/\/pengurus\/ikasmansaboy/)
  })

  test('link from ikaboy to ikasmansaboy works', async ({ page }) => {
    await page.goto('/pengurus/ikaboy')
    await page.getByText(/periode sebelumnya/).click()
    await expect(page).toHaveURL(/\/pengurus\/ikasmansaboy/)
    await expect(page.locator('h1')).toContainText('PENGURUS IKA SMANSA BOY')
  })

  test('link back from ikasmansaboy to ikaboy works', async ({ page }) => {
    await page.goto('/pengurus/ikasmansaboy')
    await page.getByText(/Kembali ke pengurus periode saat ini/).click()
    await expect(page).toHaveURL(/\/pengurus\/ikaboy/)
    await expect(page.locator('h1')).toContainText('PROFIL PENGURUS IKA')
  })

  test('old /pengurus redirects to /pengurus/ikasmansaboy', async ({ page }) => {
    await page.goto('/pengurus', { waitUntil: 'commit' })
    // Next.js 308 permanent redirect → should land on ikasmansaboy
    await expect(page).toHaveURL(/\/pengurus\/ikasmansaboy/)
    await expect(page.locator('h1')).toContainText('PENGURUS IKA SMANSA BOY')
  })
})
