import test from 'node:test';
import assert from 'node:assert';
import { initZedWasm } from '@brimdata/zed-wasm';

let zq;
test.before(async () => {
  const wasm = await initZedWasm(
    require.resolve('@brimdata/zed-wasm/dist/main.wasm')
  );
  zq = wasm.zq;
});

test('input is string', async (t) => {
  const input = '1 2 3';
  const resp = await zq({ input, program: 'this + 1' });
  assert.deepEqual(resp, [2, 3, 4]);
});
