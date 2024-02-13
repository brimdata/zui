import { test, expect } from '@playwright/test';
import * as path from 'path';
import TestApp from '../helpers/test-app';
import * as os from 'os';
import * as fsExtra from 'fs-extra';
import { getPath } from 'zui-test-data';

const tempDir = os.tmpdir();
const formats = [
  { label: 'Arrow IPC Stream', expectedSize: 46512 },
  { label: 'CSV', expectedSize: 10851 },
  { label: 'JSON', expectedSize: 13659 },
  { label: 'NDJSON', expectedSize: 13657 },
  { label: 'TSV', expectedSize: 10797 },
  { label: 'VNG', expectedSize: 7983 },
  { label: 'Zeek', expectedSize: 10138 },
  { label: 'ZJSON', expectedSize: 18007 },
  { label: 'ZNG', expectedSize: 3745 },
  { label: 'ZSON', expectedSize: 15137 },
];

test.describe('Export tests', () => {
  const app = new TestApp('Export tests');

  test.beforeAll(async () => {
    // Increase timeout due to observed long load times on test data in CI.
    // See https://github.com/brimdata/zui/pull/2967
    test.setTimeout(60000);

    await app.init();
    await app.createPool([getPath('sample.zeektsv')]);
    await app.click('button', 'Query Pool');
    await app.query('sort ts, _path');
  });

  test.afterAll(async () => {
    await app.shutdown();
  });

  formats.forEach(({ label, expectedSize }) => {
    test(`Exporting in ${label} format succeeds`, async () => {
      const file = path.join(tempDir, `results.${label}`);
      app.zui.evaluate(async ({ dialog }, filePath) => {
        dialog.showSaveDialog = () =>
          Promise.resolve({ canceled: false, filePath });
      }, file);
      await app.click('button', 'Export Results');
      await app.attached('dialog');
      const dialog = app.mainWin.getByRole('dialog');
      await app.select('Format', label);
      await dialog
        .getByRole('button')
        .filter({ hasText: 'Export To File' })
        .click();
      await app.detached('dialog');
      await app.mainWin
        .getByText(new RegExp('Export Completed: .*results\\.' + label))
        .waitFor();

      expect(fsExtra.statSync(file).size).toBe(expectedSize);
    });
  });

  test('Copy to clipboard', async () => {
    await app.click('button', 'Export Results');
    await app.attached('dialog');
    await app.select('Format', 'JSON');
    await app.click('button', 'Copy to Clipboard');
    await app.attached(/copied JSON data to clipboard/i);
    await app.click('button', 'Close');
  });

  test('Export to Pool', async () => {
    await app.query('head 5');
    await app.click('button', 'Export Results');
    await app.attached('dialog');
    await app.locate('radio', 'Pool').check();
    await app.fill('Name', 'five_row_pool');
    await app.click('button', 'Export To Pool');
    // Redirected to the new pool page
    await app.attached(/from 'sample.zeektsv' | head 5/);
    await app.attached('heading', 'five_row_pool');
    // Ensure the records are present
    await app.click('button', 'Query Pool');
    await app.attached(/5 Total Rows/);
  });
});
