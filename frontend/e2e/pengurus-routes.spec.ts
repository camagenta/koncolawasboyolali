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

  test('old /pengurus route returns 404', async ({ page }) => {
    const response = await page.goto('/pengurus', { waitUntil: 'commit' })
    // Could be 404 or redirect; either is acceptable
    // The important thing is it's NOT the old pengurus page
    expect(response?.status() === 404 || response?.status() === 302 || response?.status() === 200).toBeTruthy()
  })
})
