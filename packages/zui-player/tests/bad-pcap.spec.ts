import { play } from 'zui-player';
import { getPath } from 'zui-test-data';

play('bad_pcap_spec', (app, test) => {
  test.setTimeout(5 * 60_000);

  test('Displays zeek error message', async () => {
    app.page.setDefaultTimeout(5 * 60_000);
    await app.dropFile(getPath('vanspy.pcapng'));
    await app.attached(/with 1 error/);
  });
});
