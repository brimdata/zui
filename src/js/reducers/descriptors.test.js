/* @flow */

import * as actions from "../actions/descriptors"
import {getDescriptors} from "./descriptors"
import initStore from "../test/initStore"

const descriptor = [{type: "string", name: "_td"}, {type: "string", name: "a"}]
let store
beforeEach(() => {
  store = initStore()
})

test("getDescriptors", () => {
  const action = actions.receiveDescriptor("default", "1", descriptor)
  store.dispatch(action)
  const state = store.getState()

  expect(getDescriptors(state)).toEqual({
    "default.1": descriptor
  })
})

test("clearing descriptors", () => {
  const store = initStore()
  store.dispatch(actions.receiveDescriptor("default", "1", descriptor))
  store.dispatch(actions.clearDescriptors())
  expect(getDescriptors(store.getState())).toEqual({})
})
