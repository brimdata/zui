import { play } from 'app-player';
import { existsSync } from 'fs';

play('Copy Paste Data', (app, test) => {
  test('paste cleans up after itself', async () => {
    await app.evalMain(({ clipboard }) => clipboard.writeText('{a: 1}'));
    const file = await app.invoke('loads.paste');
    test.expect(existsSync(file)).toBe(true);
    await app.click('button', 'Load');
    await app.attached(/Successfully loaded/);
    await app.click('button', 'Query Pool');
    test.expect(existsSync(file)).toBe(false);
  });

  test('pasting data loads into pool', async () => {
    await app.evalMain(({ clipboard }) => clipboard.writeText('{a: 1}'));
    await app.invoke('loads.paste');
    await app.click('button', 'Load');
    await app.click('button', 'Query Pool');
    const results = await app.getTableResults();
    test.expect(results).toEqual(['a', '1']);
  });

  test('pasting multiple times', async () => {
    await app.evalMain(({ clipboard }) => clipboard.writeText('{a: 1}'));
    await app.invoke('loads.paste');
    await app.evalMain(({ clipboard }) => clipboard.writeText('{b: 2}'));
    await app.invoke('loads.paste');
    await app.evalMain(({ clipboard }) => clipboard.writeText('{c: 3}'));
    await app.invoke('loads.paste');

    await app.attached('listitem', 'paste');
    await app.attached('listitem', 'paste_1');
    await app.attached('listitem', 'paste_2');
    await app.click('button', 'Load');
    await app.click('button', 'Query Pool');
    await app.attached(/Successfully loaded into .*_pastes/);
  });
});
