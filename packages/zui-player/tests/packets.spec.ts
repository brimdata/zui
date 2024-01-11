import { play } from 'zui-player';
import { getPath } from 'zui-test-data';

play('packets.spec', (app, test) => {
  test('dropping a pcap does not pop up preview and load', async () => {
    await app.dropFile(getPath('sample.pcap'));
    await app.attached(/Successfully loaded into sample.pcap/);
  });

  test('getting a slice of the packets back', async () => {
    await app.click('button', 'Query Pool');
    await app.query('fuse');

    await app.click('gridcell', 'conn');
    await app.click('button', 'Packets');
    await app.attached(/Packets extracted. Opening.../);
  });

  test('loading a bad pcap displays an error message', async () => {
    await app.dropFile(getPath('bad.pcapng'));
    await app.attached(/Unable to generate full summary logs from PCAP/);
  });
});
