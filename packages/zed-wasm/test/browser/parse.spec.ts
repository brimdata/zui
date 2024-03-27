import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/test/pages/parse.html');
  await page.getByText('Wasm Ready').waitFor({ state: 'attached' });
});

test('parse a simple zed string', async ({ page }) => {
  await page.fill('input', 'zed := "world"');
  await page.click('button');
  await expect(page.locator('pre')).toContainText('"kind": "OpAssignment"');
});
