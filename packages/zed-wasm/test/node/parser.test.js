import test from 'node:test';
import assert from 'node:assert';
import { initZedWasm } from '@brimdata/zed-wasm';

let parse;
test.before(async () => {
  const wasm = await initZedWasm(
    require.resolve('@brimdata/zed-wasm/dist/main.wasm')
  );
  parse = wasm.parse;
});

test('parser', async () => {
  const resp = await parse('me := "james"');
  assert.deepEqual(resp, {
    error: undefined,
    ast: [
      {
        assignments: [
          {
            kind: 'Assignment',
            lhs: {
              kind: 'ID',
              name: 'me',
            },
            rhs: {
              kind: 'Primitive',
              text: 'james',
              type: 'string',
            },
          },
        ],
        kind: 'OpAssignment',
      },
    ],
  });
});
