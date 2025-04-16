import { play } from 'app-player';
import { getPath } from '@brimdata/sample-data';

play('packets.spec', (app, test) => {
  // Flaky in CI.
  test('dropping a pcap throw an error now', async () => {
    await app.dropFile(getPath('sample.pcap'));
    await app.attached(/wrong number of fields/);
  });
});
