import { play } from 'zui-player';
import { getPath } from 'zui-test-data';

play('Preview & Load', (app, test) => {
  test('create new pool, change key, type <enter>', async () => {
    await app.dropFile(getPath('sample.zeektsv'));
    await app.click('button', 'Pool Settings');
    await app.fill('Pool Key', 'my_new_key');
    await app.press('Enter');

    await app.attached(/successfully finished loading/i);
  });
});
