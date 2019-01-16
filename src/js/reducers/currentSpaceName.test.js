import initStore from "../test/initStore"
import * as actions from "../actions/spaces"
import {getCurrentSpaceName} from "./spaces"

let store
beforeEach(() => {
  store = initStore()
})

test("set the current space name", () => {
  store.dispatch(actions.setCurrentSpaceName("facebook"))

  expect(getCurrentSpaceName(store.getState())).toEqual("facebook")
})

test("clear the current space name", () => {
  const state = store.dispatchAll([
    store.dispatch(actions.setCurrentSpaceName("facebook")),
    store.dispatch(actions.clearSpaces())
  ])

  expect(getCurrentSpaceName(state)).toEqual(null)
})
