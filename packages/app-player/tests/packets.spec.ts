import { play } from 'app-player';
import { getPath } from '@brimdata/sample-data';

play('packets.spec', (app, test) => {
  test('dropping a pcap throw an error now', async () => {
    await app.dropFile(getPath('sample.pcap'));
    console.log('I did dropfile');
    await app.attached(/wrong number of fields/);
  });
});
