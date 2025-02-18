import { join } from 'path';
import { Lake } from './lake';
// @ts-ignore
import nodeFetch from 'node-fetch';
import * as os from 'os';

if (process.env['GITHUB_ACTIONS'] === 'true') {
  jest.setTimeout(30_000);
}

test('serve the lake', async () => {
  const root = join(os.tmpdir(), 'zed_node_lake_test');
  const lake = new Lake({ root, logs: root, addr: 'localhost' });
  lake.fetch = nodeFetch;
  await lake.start();
  await lake.stop();
});
