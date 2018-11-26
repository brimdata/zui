/* @flow */

import * as actions from "../actions/descriptors"
import * as descriptors from "./descriptors"
import initStore from "../test/initStore"

const descriptor = [{type: "string", name: "_td"}, {type: "string", name: "a"}]

let state
beforeEach(() => {
  state = initStore().dispatchAll([
    actions.receiveDescriptor("default", "1", descriptor)
  ])
})

test("something", () => {
  expect(descriptors.getDescriptors(state)).toEqual({
    "default.1": descriptor
  })
})
