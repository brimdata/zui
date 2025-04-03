import { test, expect } from '@playwright/test';
import TestApp from '../helpers/test-app';
import { getPath } from '@brimdata/sample-data';

test.describe('Histogram Spec', () => {
  const app = new TestApp('Histogram Spec');

  test.beforeAll(async () => {
    await app.init();
  });

  test.afterAll(async () => {
    await app.shutdown();
  });

  test('Histogram appears for zeek data', async () => {
    await app.createPool([getPath('small-zeek.bsup')]);
    await app.click('button', 'Query Pool');
    await app.query('');

    const chart = app.find(`[aria-label="histogram"]`);
    await expect(chart).toBeVisible();
  });
});
