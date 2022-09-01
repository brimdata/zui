import initTestStore from "src/test/unit/helpers/initTestStore"
import Queries from "."
import QueryVersions from "../QueryVersions"
import {makeBuildSelector} from "./selectors"

const store = initTestStore()

test("build selector", () => {
  store.dispatch(Queries.addItem({name: "My Queriy", id: "1"}))
  store.dispatch(Queries.addItem({name: "My Queriy", id: "2"}))
  store.dispatch(
    QueryVersions.at("1").create({
      ts: new Date().toISOString(),
      version: "0.1",
      value: "count()",
      pins: [{type: "from", value: "mypool"}],
    })
  )
  const build1 = makeBuildSelector()
  const build2 = makeBuildSelector()

  const instance1 = build1(store.getState(), "1")
  const instance2 = build2(store.getState(), "2")
  const instance3 = build1(store.getState(), "1")
  const instance4 = build2(store.getState(), "2")
  expect(instance1).toBe(instance3)
  expect(instance2).toBe(instance4)
})
