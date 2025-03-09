import {groupByDelimiter} from "./group-by"

test("group by slash", () => {
  const data = [{name: "mine / query1"}, {name: "base"}, {name: "a/b/c/d/e/f"}]
  const result = groupByDelimiter(data as any, "/")

  expect(result).toMatchInlineSnapshot(`
    [
      {
        "children": [
          {
            "name": "mine / query1",
          },
        ],
        "group": [
          "mine",
        ],
        "id": "0-0",
        "name": "mine",
      },
      {
        "name": "base",
      },
      {
        "children": [
          {
            "children": [
              {
                "children": [
                  {
                    "children": [
                      {
                        "children": [
                          {
                            "name": "a/b/c/d/e/f",
                          },
                        ],
                        "group": [
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
                    "group": [
                      "a",
                      "b",
                      "c",
                      "d",
                    ],
                    "id": "2-3",
                    "name": "d",
                  },
                ],
                "group": [
                  "a",
                  "b",
                  "c",
                ],
                "id": "2-2",
                "name": "c",
              },
            ],
            "group": [
              "a",
              "b",
            ],
            "id": "2-1",
            "name": "b",
          },
        ],
        "group": [
          "a",
        ],
        "id": "2-0",
        "name": "a",
      },
    ]
  `)
})
