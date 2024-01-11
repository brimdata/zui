const { parse, zq } = require('@brimdata/zed-wasm');

test('parse works in cjs env', async () => {
  const resp = await parse('n := "james"');
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
  const resp = await zq({
    input: '1 2 3',
    program: 'this * 10',
  });
  expect(resp).toEqual([10, 20, 30]);
});
