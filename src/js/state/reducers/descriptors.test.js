/* @flow */

import {clearDescriptors, receiveDescriptor} from "../actions"
import {getDescriptors} from "./descriptors"
import initTestStore from "../../test/initTestStore"

const descriptor = [{type: "string", name: "_td"}, {type: "string", name: "a"}]
let store
beforeEach(() => {
  store = initTestStore()
})

test("getDescriptors", () => {
  const action = receiveDescriptor("default", "1", descriptor)
  store.dispatch(action)
  const state = store.getState()

  expect(getDescriptors(state)).toEqual({
    "default.1": descriptor
  })
})

test("clearing descriptors", () => {
  const store = initTestStore()
  store.dispatch(receiveDescriptor("default", "1", descriptor))
  store.dispatch(clearDescriptors())
  expect(getDescriptors(store.getState())).toEqual({})
})
