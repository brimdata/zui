/* @flow */
import {getInvestigation} from "./investigation"
import {newProbe} from "../actions/investigation"
import initTestStore from "../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

function get() {
  return getInvestigation(store.getState())
}

test("new probe", () => {
  const probe = {ts: new Date().getTime()}
  store.dispatch(newProbe(probe))

  expect(get()).toEqual([
    {
      ts: expect.any(Number)
    }
  ])
})
