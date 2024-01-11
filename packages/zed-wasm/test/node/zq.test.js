import test from 'node:test';
import assert from 'node:assert';
import { zq } from '@brimdata/zed-wasm';

test('input is string', async (t) => {
  const input = '1 2 3';
  const resp = await zq({ input, program: 'this + 1' });
  assert.deepEqual(resp, [2, 3, 4]);
});
