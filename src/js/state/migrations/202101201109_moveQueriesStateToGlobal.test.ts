import getTestState from "../../test/helpers/getTestState"
import migrate from "./202101201109_moveQueriesStateToGlobal"
import init from "../../../../ppl/queries/initial"

test("migrating 202101201109_moveQueriesStateToGlobal", () => {
  let {data} = getTestState("v0.22.0")

  let next = migrate(data)

  const expectedQueries = init()
  expectedQueries.items.push(
    {
      id: "dd6381e231",
      value: "added query A",
      name: "added query A",
      description: "",
      tags: []
    },
    {
      id: "ddea06acc0",
      value: "added query B",
      name: "added query B",
      description: "",
      tags: []
    }
  )

  expect(next.globalState.queries).toStrictEqual(expectedQueries)
})
