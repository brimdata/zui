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
