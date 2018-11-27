import initStore from "../test/initStore"
import * as columns from "./columns"
import * as actions from "../actions/columns"

test("initialState getAll", () => {
  const store = initStore()
  const state = store.getState()

  expect(columns.getAll(state)).toEqual([])
})

test("set columns", () => {
  const store = initStore()
  store.dispatch(actions.setColumns([{name: "_path", type: "string"}]))
  const state = store.getState()
  expect(columns.getAll(state)).toEqual([{name: "_path", type: "string"}])
})

test("toggle column adds column if it doesn't exist", () => {
  const store = initStore()
  const state = store.dispatchAll([
    actions.toggleColumn({name: "duration", type: "number"})
  ])

  expect(columns.getAll(state)).toEqual([{name: "duration", type: "number"}])
})

test("toggle column removes column if exists", () => {})
const store = initStore()
const state = store.dispatchAll([
  actions.toggleColumn({name: "duration", type: "number"}),
  actions.toggleColumn({name: "duration", type: "number"})
])

expect(columns.getAll(state)).toEqual([])

test("#createColumns builds Columns object", () => {
  const tds = ["1"]
  const all = [{name: "a", type: "string"}, {name: "b", type: "number"}]
  const visible = [{name: "b", type: "number"}]
  const cols = columns.createColumns(tds, all, visible)

  expect(cols.getTds()).toEqual(tds)
  expect(cols.getAll()).toEqual(all)
  expect(cols.getVisible()).toEqual(visible)
})

test("#createColumns sets visible to all if visible is empty", () => {
  const tds = ["1"]
  const all = [{name: "a", type: "string"}, {name: "b", type: "number"}]
  const visible = []
  const cols = columns.createColumns(tds, all, visible)

  expect(cols.getAll()).toEqual(all)
  expect(cols.getVisible()).toEqual(all)
})
