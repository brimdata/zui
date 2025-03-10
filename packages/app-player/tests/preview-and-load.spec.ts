import { play } from 'app-player';
import { getPath } from '@brimdata/sample-data';

play('Preview & Load', (app, test) => {
  test('create new pool, change key, type <enter>', async () => {
    await app.dropFile(getPath('sample.zeektsv'));
    await app.fill('Pool Key', 'my_new_key');
    await app.press('Enter');

    await app.attached(/successfully finished loading/i);
  });
});
