import {groupBySlash} from "./group-by-slash"

test("group by slash", () => {
  const data = [{name: "mine / query1"}, {name: "base"}, {name: "a/b/c/d/e/f"}]
  const result = groupBySlash(data as any)

  expect(result).toEqual([
    {
      name: "mine",
      children: [
        {
          name: "query1",
        },
      ],
    },
    {name: "base"},
    {
      name: "a",
      children: [
        {
          name: "b",
          children: [
            {
              name: "c",
              children: [
                {name: "d", children: [{name: "e", children: [{name: "f"}]}]},
              ],
            },
          ],
        },
      ],
    },
  ])
})
