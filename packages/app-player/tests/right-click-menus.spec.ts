import { play } from 'app-player';
import { getPath } from '@brimdata/sample-data';

play('right-click-menus', (app, test) => {
  test.beforeAll(async () => {
    await app.dropFile(getPath('small-zeek.bsup'));
    await app.click('button', 'Load');
    await app.attached(/Successfully/);
    await app.click('button', 'Query Pool');
  });

  test('Inspector node menu', async () => {
    await app.click('button', 'Inspector');
    await app.click('button', 'Expand Rows');
    await app.rightClick(/_path/);
    await app.click(/Filter == Value/);
    await app.attached(/_path=="capture_loss"/);
    await app.rightClick(/acks/);
    await app.click(/Count By Field/);
    await app.attached(/| count\(\) by acks/);
  });

  test('table cell menu', async () => {
    await app.query('fuse');
    await app.click('button', 'Table');
    await app.rightClick('gridcell', 'files');
    await app.click(/Count By Field/);
    await app.attached(/count\(\) by _path/);
  });

  test('sort asc', async () => {
    await app.query('fuse');
    await app.click('button', 'Table');
    await app.rightClick('gridcell', 'conn');
    await app.click(/Sort Asc/);
    await app.attached(/sort _path/);
  });

  test('sort desc', async () => {
    await app.query('fuse');
    await app.click('button', 'Inspector');
    await app.click('button', 'Collapse Rows');
    await app.rightClick(/files/);
    await app.click(/Sort Desc/);
    await app.attached(/sort -r _path/);
  });

  test('hide table column', async () => {
    await app.query('fuse');
    await app.click('button', 'Table');
    await app.click('button', 'ts Header Menu');
    await app.click(/Hide Column/);
    await app.detached('columnheader', 'ts');
  });

  test('who is', async () => {
    await app.query('has(id.orig_h) | cut id.orig_h | head 1');
    await app.click('button', 'Inspector');
    await app.click('button', 'Expand Rows');
    await app.rightClick(/192.168.1.110/);
    await app.click('listitem', 'Whois Lookup');
    await app.attached(/Whois Result/);
    await app.click('button', 'Done');
  });

  test('virus total', async () => {
    await app.query('cut id.orig_h');
    await app.click('button', 'Inspector');
    await app.click('button', 'Expand Rows');
    await app.rightClick(/192.168.1.110/);
    await app.attached('listitem', 'Virus Total');
  });

  test('inspector show details', async () => {
    await app.query('_path=="conn" | head 1');
    await app.click('button', 'Inspector');
    await app.click('button', 'Expand Rows');
    await app.rightClick('gridcell', 'conn');
    await app.click('listitem', 'Show In Detail Pane');
    await app.attached('button', 'Detail', { pressed: true });
    await app.click('button', 'Toggle Right Sidebar'); // Hide It Again
  });

  test('table show details', async () => {
    await app.query('_path=="conn" | head 1');
    await app.click('button', 'Table');
    await app.rightClick('gridcell', 'conn');
    await app.click('listitem', 'Show In Detail Pane');
    await app.attached('button', 'Detail', { pressed: true });
    await app.click('button', 'Toggle Right Sidebar'); // Hide It Again
  });
});
