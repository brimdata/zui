import { play } from 'zui-player';
import { getPath } from '@brimdata/sample-data';

play('Set As From Pin', (app, test) => {
  test('when no session tab exists', async () => {
    // it creates a session tab
    await app.dropFile(getPath('small-zeek.zng'));
    await app.click('button', 'Load');
    await app.attached(/Successfully/);
    await app.rightClick('treeitem', 'small-zeek.zng');
    const tabCount = await app.getTabCount();
    await app.click('listitem', 'Use as From Pin');
    await app.attached('button', 'from small-zeek.zng');
    test.expect(await app.getTabCount()).toBe(tabCount + 1);
  });

  test('when a session tab does exist', async () => {
    // it re-uses the existing session tab
    await app.dropFile(getPath('small-zeek.zng'));
    await app.click('button', 'Load');
    await app.attached(/Successfully/);
    await app.rightClick('treeitem', 'small-zeek.zng_1');
    const tabCount = await app.getTabCount();
    await app.click('listitem', 'Use as From Pin');
    await app.attached('button', 'from small-zeek.zng_1');
    test.expect(await app.getTabCount()).toBe(tabCount);
  });
});
