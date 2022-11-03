import {groupByDelimeter} from "./group-by"

test("group by slash", () => {
  const data = [{name: "mine / query1"}, {name: "base"}, {name: "a/b/c/d/e/f"}]
  const result = groupByDelimeter(data as any, "/")

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
        "id": "mine",
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
                        "id": "a/b/c/d/e",
                        "name": "e",
                      },
                    ],
                    "group": Array [
                      "a",
                      "b",
                      "c",
                      "d",
                    ],
                    "id": "a/b/c/d",
                    "name": "d",
                  },
                ],
                "group": Array [
                  "a",
                  "b",
                  "c",
                ],
                "id": "a/b/c",
                "name": "c",
              },
            ],
            "group": Array [
              "a",
              "b",
            ],
            "id": "a/b",
            "name": "b",
          },
        ],
        "group": Array [
          "a",
        ],
        "id": "a",
        "name": "a",
      },
    ]
  `)
})
