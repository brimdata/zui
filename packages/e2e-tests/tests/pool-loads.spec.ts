import { expect, test } from '@playwright/test';
import TestApp from '../helpers/test-app';
import { getPath } from 'zui-test-data';

test.describe('Pool Loads', () => {
  const app = new TestApp('Pool Loads');

  test.beforeAll(async () => {
    await app.init();
  });

  test.afterAll(async () => {
    await app.shutdown();
  });

  // These depend on the order in which they run. They must all be run together.
  test('load data into a pool', async () => {
    await app.createPool([getPath('prs.json')]);
    await app.query('count()');
    await app.hidden('generic', 'Load Successful');

    const results = await app.getViewerResults();
    expect(results).toEqual(['this', '1']);
    await app.hidden(/successfully loaded/i);
  });

  test('load more data into the pool', async () => {
    await app.click('treeitem', 'prs.json');
    await app.dropFile(getPath('prs.json'));
    await app.page.getByLabel('Pool').selectOption({ label: 'prs.json' });
    await app.click('button', 'Load');
    await app.attached(/successfully loaded/i);
    await app.query('count()');
    const results = await app.getViewerResults();
    expect(results).toEqual(['this', '2']);
  });

  test('bad data displays an error message', async () => {
    await app.dropFile(getPath('soccer-ball.png'));
    await app.attached(/Format Detection Error/i);
    expect(app.locate('button', 'Load').isDisabled);
  });
});
