import { expect, test } from '@playwright/test';
import { getPath } from '@brimdata/sample-data';
import TestApp from '../helpers/test-app';

test.describe('Table Testing', () => {
  const app = new TestApp('Table Testing');

  test.beforeAll(async () => {
    await app.init();
  });

  test.afterAll(async () => {
    await app.shutdown();
  });

  test('named type shows columns', async () => {
    const path = getPath('named-type.zson');
    await app.createPool([path]);
    await app.click('button', 'Query Pool');
    await app.query('yield value.after'); // This is a named type
    const columnheader = app.results.getByRole('columnheader');
    await columnheader.first().waitFor();
    const texts = await columnheader.allInnerTexts();
    expect(texts).toEqual(['Id', 'IsDeleted']);
  });

  test('right click on a table cell shows menu', async () => {
    await app.query('');
    await app.rightClick('gridcell', 'false');
    await app.attached(/Filter == Value/);
  });
});
