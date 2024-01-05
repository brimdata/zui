import { play } from 'zui-player';
import { getPath } from 'zui-test-data';

play('right-click-menus', (app, test) => {
  test.beforeAll(async () => {
    await app.dropFile(getPath('zillow.csv'));
    await app.click('button', 'Load');
    await app.attached(/Successfully/);
    await app.click('button', 'Query Pool');
  });

  test('Inspector node menu', async () => {
    await app.click('button', 'Inspector');
    await app.click('button', 'Expand Rows');
    await app.rightClick(/Days on Zillow/);
    await app.click(/Filter == Value/);
    await app.attached(/this\["Days on Zillow"\]==55\./);
    await app.rightClick(/"Auction"/);
    await app.click(/Count By Field/);
    await app.attached(/count\(\) by this\["Listing description"\]/);
  });

  test('table cell menu', async () => {
    await app.query('fuse');
    await app.click('button', 'Table');
    await app.rightClick(/zillow\.com/);
    await app.click(/Count By Field/);
    await app.attached(/count\(\) by this\["Property URL"\]/);
  });

  test('table header menu', async () => {
    await app.query('fuse');
    await app.click('button', 'Table');
    await app.click('button', 'Property URL Header Menu');
    await app.click(/Hide Column/);
    await app.detached('columnheader', 'Property URL');
  });
});
