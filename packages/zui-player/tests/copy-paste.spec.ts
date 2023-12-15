import { play } from 'zui-player';

play('Copy Paste Data', (app, test) => {
  test('copy data from the clipboard', async () => {
    app.debugLogs();
    await app.evalMain(({ clipboard }) => clipboard.writeText('{a: 1}'));
    await app.invoke('loads.paste');
    await app.click('button', 'Load');
    await app.click('button', 'Query Pool');
    const results = await app.getViewerResults();
    test.expect(results).toEqual(['a', '1']);
    app.sleep(10);
  });
});
