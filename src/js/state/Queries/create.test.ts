import {setupStore} from "src/test/unit"
import Queries from "."

const {dispatch, select} = setupStore()

test("creating a query", () => {
  const q = dispatch(
    Queries.create({
      name: "My Query",
      pins: [{type: "from", value: "demo"}],
    })
  )

  expect(select(Queries.getGroupById("root")).items.length).toBe(1)
  expect(q.pins).toEqual([{type: "from", value: "demo"}])
})
