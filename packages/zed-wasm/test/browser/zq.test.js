import { test, expect } from '@playwright/test';

test('page loads', async ({ page }) => {
  await page.goto('/test/pages/zq.html');
  await expect(
    page.getByRole('heading', { name: 'Parse Test' })
  ).toBeAttached();
});

test('run zq', async ({ page }) => {
  await page.goto('/test/pages/zq.html');
  await page.fill('[name=input]', '1 2 3');
  await page.fill('[name=script]', 'this * 10');
  await page.click('button');
  await expect(page.locator('pre')).toContainText('[10,20,30]');
});
