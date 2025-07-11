import { test, expect } from '@playwright/test';
import * as path from 'path';
import TestApp from '../helpers/test-app';
import * as os from 'os';
import { stat } from 'fs/promises';
import { getPath } from '@brimdata/sample-data';

const tempDir = os.tmpdir();
const formats = [
  { label: 'Arrow IPC Stream', expectedSize: 46512 },
  // { label: 'CSUP', expectedSize: 7984 },
  { label: 'BSUP', expectedSize: 3745 },
  { label: 'CSV', expectedSize: 10897 },
  { label: 'JSON', expectedSize: 13659 },
  { label: 'JSUP', expectedSize: 18007 },
  { label: 'NDJSON', expectedSize: 13657 },
  { label: 'SUP', expectedSize: 15183 },
  { label: 'TSV', expectedSize: 10843 },
  { label: 'Zeek', expectedSize: 10138 },
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
      await app.exportAsFormat(label, expectedSize, tempDir);
    });
  });

  test('Copy to clipboard', async () => {
    await app.click('button', 'Export Results');
    await app.attached('dialog');
    await app.select('Format', 'JSON');
    await app.click(/Copy to Clipboard/i);
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

  test('Export with error', async () => {
    const filePath = path.join(tempDir, `error.csv`);
    app.mockSaveDialog({ canceled: false, filePath });
    await app.query('values uid');
    await app.click('button', 'Export Results');
    await app.attached('dialog');
    await app.locate('radio', 'File').check();
    await app.select('Format', 'CSV');
    await app.click('button', 'Export to File ↩');
    await app.attached(/Error: CSV output encountered non-record value/);
    await expect(stat(filePath)).rejects.toThrowError('no such file');
  });

  test(`Exporting in Parquet format succeeds`, async () => {
    await app.createPool([getPath('cities.json')]);
    await app.click('button', 'Query Pool');
    await app.exportAsFormat('Parquet', 851922, tempDir);
  });
});
