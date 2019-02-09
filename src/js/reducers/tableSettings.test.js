/* @flow */

import * as actions from "../actions/tableSettings"
import initStore from "../test/initStore"
import * as selector from "../selectors/tableSettings"

let store
beforeEach(() => {
  store = initStore()
})

test("get initial state", () => {
  const state = store.getState()
  expect(selector.getTableSettings(state)).toEqual({})
})

test("Update a column setting", () => {
  const state = store.dispatchAll([
    actions.updateColumnSetting("conn", "_path:string", {
      width: 22,
      isVisible: true,
      position: 0
    }),
    actions.updateColumnSetting("conn", "ts:time", {
      width: 200,
      isVisible: false,
      position: 1
    })
  ])

  expect(selector.getTableSettings(state)["conn"]).toEqual({
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
