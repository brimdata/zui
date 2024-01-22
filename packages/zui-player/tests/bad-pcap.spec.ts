import { play } from 'zui-player';
import { getPath } from 'zui-test-data';

play('bad_pcap_spec', (app, test) => {
  test('Displays zeek error message', async () => {
    await app.dropFile(getPath('vanspy.pcapng'));
    await app.attached(/with 1 error/);
    await app.attached(/zeekrunner exited with code 1/);
  });
});
