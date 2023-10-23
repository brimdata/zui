import { expect, test } from '@playwright/test';
import TestApp from '../helpers/test-app';
import { getPath } from 'zui-test-data';

test.describe('Preview and Load', () => {
  const app = new TestApp('Preview and Load');

  test.beforeAll(async () => {
    await app.init();
  });

  test.afterAll(async () => {
    await app.shutdown();
  });

  test('create new pool, change key, type <enter>', async () => {
    await app.sleep(5000);
    await app.dropFile(getPath('sample.tsv'));
    await app.click('button', 'Pool Settings');
    await app.fill('Pool Key', 'my_new_key');
    await app.press('Enter');

    await app.attached(/successfully finished loading/i);
  });
});
