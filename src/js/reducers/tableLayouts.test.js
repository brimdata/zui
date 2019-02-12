/* @flow */

import {getTableLayouts} from "../selectors/tableLayouts"
import {updateTableLayout} from "../actions/tableLayouts"
import initStore from "../test/initStore"

let store
beforeEach(() => {
  store = initStore()
})

test("get initial state", () => {
  const state = store.getState()
  expect(getTableLayouts(state)).toEqual({})
})

test("Update a column setting", () => {
  const state = store.dispatchAll([
    updateTableLayout("conn", {
      "_path:string": {
        width: 22,
        isVisible: true,
        position: 0
      },
      "ts:time": {
        width: 200,
        isVisible: false,
        position: 1
      }
    })
  ])

  expect(getTableLayouts(state)["conn"]).toEqual({
    "_path:string": {
      width: 22,
      isVisible: true,
      position: 0
    },
    "ts:time": {
      width: 200,
      isVisible: false,
      position: 1
    }
  })
})
