import { expect, test } from '@playwright/test';
import TestApp from '../helpers/test-app';
import { getPath } from '@brimdata/sample-data';

test.describe('Pool Loads (successes)', () => {
  const app = new TestApp('Pool Loads (succeeses)');

  test.beforeAll(async () => {
    await app.init();
  });

  test.afterAll(async () => {
    await app.shutdown();
  });

  // These depend on the order in which they run. They must all be run together.
  test('load data into a pool', async () => {
    await app.createPool([getPath('prs.json')]);
    await app.click('button', 'Query Pool');
    await app.query('count()');
    await app.hidden('generic', 'Load Successful');

    const results = await app.getInspectorResults();
    expect(results).toEqual(['1 ( uint64 )']);
  });

  test('load more data into the pool', async () => {
    await app.click('treeitem', 'prs.json');
    await app.dropFile(getPath('prs.json'));
    await app.page
      .getByLabel('Pool', { exact: true })
      .nth(0)
      .selectOption({ label: 'prs.json' });
    await app.click('button', 'Load');
    await app.attached(/successfully loaded/i);
    await app.click('button', 'Query Pool');
    await app.query('count()');
    const results = await app.getInspectorResults();
    expect(results).toEqual(['2 ( uint64 )']);
  });
});
