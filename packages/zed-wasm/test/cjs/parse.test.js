const { initZedWasm } = require('@brimdata/zed-wasm');

let wasm;
beforeAll(async () => {
  wasm = await initZedWasm(
    require.resolve('@brimdata/zed-wasm/dist/main.wasm')
  );
});

test('parse works in cjs env', async () => {
  const resp = await wasm.parse('n := "james"');
  expect(resp).toMatchInlineSnapshot(`
    {
      "ast": [
        {
          "assignments": [
            {
              "kind": "Assignment",
              "lhs": {
                "kind": "ID",
                "name": "n",
              },
              "rhs": {
                "kind": "Primitive",
                "text": "james",
                "type": "string",
              },
            },
          ],
          "kind": "OpAssignment",
        },
      ],
      "error": undefined,
    }
  `);
});

test('zq works in cjs env', async () => {
  const resp = await wasm.zq({
    input: '1 2 3',
    program: 'this * 10',
    outputFormat: 'zjson',
    decodeAs: 'js',
  });
  expect(resp).toEqual([10, 20, 30]);
});
