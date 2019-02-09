/* @flow */

import * as actions from "../actions/columnSettings"
import initStore from "../test/initStore"
import * as selector from "../selectors/columnSettings"

let store
beforeEach(() => {
  store = initStore()
})

test("get initial state", () => {
  const state = store.getState()
  expect(selector.getColumnSettings(state)).toEqual({})
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

  expect(selector.getColumnSettings(state)["conn"]).toEqual({
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
