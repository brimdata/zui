import { expect, test } from '@playwright/test';
import TestApp from '../helpers/test-app';
import { getPath } from 'zui-test-data';

test.describe('Pool Loads (failures)', () => {
  const app = new TestApp('Pool Loads (failures)');

  test.beforeAll(async () => {
    await app.init();
  });

  test.afterAll(async () => {
    await app.shutdown();
  });

  test('bad data displays an error message', async () => {
    await app.dropFile(getPath('soccer-ball.png'));
    await app.attached(/Format Detection Error/i);
    expect(app.locate('button', 'Load').isDisabled);
  });
});
