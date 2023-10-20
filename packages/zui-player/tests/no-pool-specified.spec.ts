import { expect, test } from '@playwright/test';
import TestApp from '../helpers/test-app';
import { getPath } from 'zui-test-data';

test.describe('No Pool Specified State', () => {
  const app = new TestApp('No Pool Specified');

  test.beforeAll(async () => {
    await app.init();
  });

  test.afterAll(async () => {
    await app.shutdown();
  });

  test('Query missing a from with no pools', async () => {
    await app.click('button', 'create');
    await app.click('listitem', 'New Query Session');
    await app.attached(/load data into a pool/i);
  });

  test('Query missing a from with some pools', async () => {
    await app.createPool([getPath('small-zeek.zng')]);
    await app.click('button', 'create');
    await app.click('listitem', 'New Query Session');

    await app.attached(/click one of the pools/i);

    await app.attached('list', 'from-pin-list');
    await app.click('listitem', 'small-zeek.zng');

    const stats = await app.getViewerStats();
    expect(stats).toEqual({ results: 31, shapes: 8 });
  });
});
