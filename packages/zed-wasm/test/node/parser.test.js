import test from 'node:test';
import assert from 'node:assert';
import { parse } from '@brimdata/zed-wasm';

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
