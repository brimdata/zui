import { play } from 'app-player';
import { getPath } from '@brimdata/sample-data';

// Timeouts are increased due to observed long pcap load times in CI.
// See https://github.com/brimdata/zui/pull/2978
play('packets.spec', (app, test) => {
  test('dropping a pcap throw an error now', async () => {
    await app.dropFile(getPath('sample.pcap'));
    await app.attached(/Error Reading Data/);
  });
});
