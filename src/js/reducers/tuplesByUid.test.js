import initStore from "../test/initStore"
import * as actions from "../actions/tuplesByUid"
import {getTuplesByUid} from "../reducers/tuplesByUid"

let store
beforeEach(() => {
  store = initStore()
})

test("receiving tuples", () => {
  store.dispatch(actions.addTuplesByUid("abc", [["1", "conn"]]))
  expect(getTuplesByUid(store.getState())).toEqual({abc: [["1", "conn"]]})
})

test("clearing tuples", () => {
  const state = store.dispatchAll([
    actions.addTuplesByUid("abc", [["1", "conn"]]),
    actions.clearTuplesByUid()
  ])

  expect(getTuplesByUid(state)).toEqual({})
})
