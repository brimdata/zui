import { test, expect } from '@playwright/test';
import { getPath } from 'zui-test-data';
import TestApp from '../helpers/test-app';

test.describe('Query tests', () => {
  const app = new TestApp('Query tests');

  test.beforeAll(async () => {
    await app.init();
    await app.createPool([getPath('sample.zeektsv')]);
    await app.click('button', 'Query Pool');
  });

  test.afterAll(async () => {
    await app.shutdown();
  });

  test('session queries are the default and ordered properly in history', async () => {
    await app.query('1');
    await app.query('2');
    await app.query('3');
    const history = await app.mainWin.locator(
      '[aria-label="history-pane"] [role="treeitem"]'
    );
    const entries = await history.evaluateAll<string[], HTMLElement>((nodes) =>
      nodes.map((n) => n.innerText.trim().replaceAll(/\s+/g, ' '))
    );
    const expected = [
      "from 'sample.zeektsv' | 3 now",
      "from 'sample.zeektsv' | 2 now",
      "from 'sample.zeektsv' | 1 now",
      "from 'sample.zeektsv' now",
    ];
    expect(entries).toEqual(expected);
  });

  test("named queries' creation, modification, update/save, proper outdated status display", async () => {
    // creation
    await app.click('button', 'Save as New Query');
    await app.fill('Query Name', 'Test Query Name');
    await app.press('Enter');
    await app.click('button', 'Queries');
    await app.attached('treeitem', 'Test Query Name');

    // modification
    await app.query('4');
    await app.attached('button', 'Test Query Name*');

    // update
    await app.click('button', 'Update Query');
    await app.attached('button', 'Test Query Name');
  });

  test('named query, save as => new named query', async () => {
    await app.click('button', 'Save as New Query');
    await app.fill('Query Name', 'Another Test Query');
    await app.press('Enter');
    await app.attached('treeitem', 'Another Test Query');
  });
});
