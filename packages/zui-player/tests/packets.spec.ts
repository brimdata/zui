import { play } from 'zui-player';
import { getPath } from 'zui-test-data';
import { isCI } from '../helpers/env';

// Timeouts are increased due to observed long pcap load times in CI.
// See
play('packets.spec', (app, test) => {
  test('dropping a pcap does not pop up preview and load', async () => {
    if (isCI()) {
      test.setTimeout(120000);
      app.page.setDefaultTimeout(120000);
    }
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
    if (isCI()) {
      test.setTimeout(120000);
      app.page.setDefaultTimeout(120000);
    }
    await app.dropFile(getPath('bad.pcapng'));
    await app.attached(/Unable to generate full summary logs from PCAP/);
  });
});
