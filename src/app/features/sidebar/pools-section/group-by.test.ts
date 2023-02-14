import {groupByDelimiter} from "./group-by"

test("group by slash", () => {
  const data = [{name: "mine / query1"}, {name: "base"}, {name: "a/b/c/d/e/f"}]
  const result = groupByDelimiter(data as any, "/")

  expect(result).toMatchInlineSnapshot(`
    Array [
      Object {
        "children": Array [
          Object {
            "name": "mine / query1",
          },
        ],
        "group": Array [
          "mine",
        ],
        "id": "0-0",
        "name": "mine",
      },
      Object {
        "name": "base",
      },
      Object {
        "children": Array [
          Object {
            "children": Array [
              Object {
                "children": Array [
                  Object {
                    "children": Array [
                      Object {
                        "children": Array [
                          Object {
                            "name": "a/b/c/d/e/f",
                          },
                        ],
                        "group": Array [
                          "a",
                          "b",
                          "c",
                          "d",
                          "e",
                        ],
                        "id": "2-4",
                        "name": "e",
                      },
                    ],
                    "group": Array [
                      "a",
                      "b",
                      "c",
                      "d",
                    ],
                    "id": "2-3",
                    "name": "d",
                  },
                ],
                "group": Array [
                  "a",
                  "b",
                  "c",
                ],
                "id": "2-2",
                "name": "c",
              },
            ],
            "group": Array [
              "a",
              "b",
            ],
            "id": "2-1",
            "name": "b",
          },
        ],
        "group": Array [
          "a",
        ],
        "id": "2-0",
        "name": "a",
      },
    ]
  `)
})
