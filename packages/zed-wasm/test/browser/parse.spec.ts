import { test, expect } from '@playwright/test';

test('page loads', async ({ page }) => {
  await page.goto('/test/pages/parse.html');
  await expect(
    page.getByRole('heading', { name: 'Parse Test' })
  ).toBeAttached();
});

test('parse a simple zed string', async ({ page }) => {
  await page.goto('/test/pages/parse.html');
  await page.fill('input', 'zed := "world"');
  await page.click('button');
  await expect(page.locator('pre')).toContainText('"kind": "OpAssignment"');
});
