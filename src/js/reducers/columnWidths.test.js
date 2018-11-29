import initStore from "../test/initStore"
import * as columnWidths from "./columnWidths"
import * as actions from "../actions/columnWidths"

test("initialState", () => {
  const store = initStore()
  const state = store.getState()
  expect(columnWidths.getAll(state)).toEqual({default: 75})
})

test("set a column width", () => {
  const store = initStore()
  store.dispatch(actions.setWidths({_path: 35}))
  const state = store.getState()
  expect(columnWidths.getAll(state)).toEqual({default: 75, _path: 35})
})
