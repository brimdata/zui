/* @flow */
import {getInvestigation} from "./investigation"
import {createFinding} from "../actions/investigation"
import initTestStore from "../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

function get() {
  return getInvestigation(store.getState())
}

test("new finding", () => {
  const finding = {ts: new Date()}
  store.dispatch(createFinding(finding))

  expect(get()).toEqual([
    {
      ts: expect.any(Date)
    }
  ])
})
