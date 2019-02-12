/* @flow */

import {getTableLayouts} from "../selectors/tableLayouts"
import {
  hideAllColumns,
  hideColumn,
  showAllColumns,
  showColumn,
  updateTableLayout
} from "../actions/tableLayouts"
import initStore from "../test/initStore"

const tableId = "test"
let store
beforeEach(() => {
  store = initStore()
})

test("get initial state", () => {
  const state = store.getState()
  expect(getTableLayouts(state)).toEqual({})
})

test("Bulk update column settings", () => {
  const state = store.dispatchAll([
    updateTableLayout(tableId, {
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
    }),
    updateTableLayout(tableId, {
      "_path:string": {width: 100}
    })
  ])

  expect(getTableLayouts(state)[tableId]).toEqual({
    "_path:string": {
      width: 100,
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

test("hide one column", () => {
  const state = store.dispatchAll([
    hideColumn(tableId, {name: "a", type: "string"})
  ])

  const table = getTableLayouts(state)[tableId]

  expect(table["a:string"]).toEqual({isVisible: false})
})

test("show one column", () => {
  const state = store.dispatchAll([
    hideColumn(tableId, {name: "a", type: "string"}),
    showColumn(tableId, {name: "a", type: "string"})
  ])

  const table = getTableLayouts(state)[tableId]

  expect(table["a:string"]).toEqual({isVisible: true})
})

test("show all columns", () => {
  const state = store.dispatchAll([
    hideColumn(tableId, {name: "a", type: "string"}),
    hideColumn(tableId, {name: "b", type: "string"}),
    hideColumn(tableId, {name: "c", type: "string"}),
    showAllColumns(tableId)
  ])

  const table = getTableLayouts(state)[tableId]

  expect(table["a:string"]).toEqual({isVisible: true})
  expect(table["b:string"]).toEqual({isVisible: true})
  expect(table["c:string"]).toEqual({isVisible: true})
})

test("hide all columns", () => {
  const tableId = "test"

  const state = store.dispatchAll([
    showColumn(tableId, {name: "a", type: "string"}),
    showColumn(tableId, {name: "b", type: "string"}),
    showColumn(tableId, {name: "c", type: "string"}),
    hideAllColumns(tableId)
  ])

  const table = getTableLayouts(state)[tableId]

  expect(table["a:string"]).toEqual({isVisible: false})
  expect(table["b:string"]).toEqual({isVisible: false})
  expect(table["c:string"]).toEqual({isVisible: false})
})
