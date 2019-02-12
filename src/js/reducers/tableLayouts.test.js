/* @flow */

import {getTableLayouts} from "../selectors/tableLayouts"
import {
  hideAllColumns,
  hideColumn,
  showAllColumns,
  showColumn,
  updateTableLayout
} from "../actions/tableLayouts"
import TableLayout from "../models/TableLayout"
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
  const tableLayout = new TableLayout(
    tableId,
    [
      {name: "a", type: "string"},
      {name: "b", type: "string"},
      {name: "c", type: "string"}
    ],
    {
      "a:string": {isVisible: false},
      "b:string": {isVisible: false},
      "c:string": {isVisible: false}
    }
  )

  const state = store.dispatchAll([showAllColumns(tableLayout)])

  const table = getTableLayouts(state)[tableId]

  expect(table["a:string"]).toEqual({isVisible: true})
  expect(table["b:string"]).toEqual({isVisible: true})
  expect(table["c:string"]).toEqual({isVisible: true})
})

test("hide all columns", () => {
  const tableLayout = new TableLayout(
    tableId,
    [
      {name: "a", type: "string"},
      {name: "b", type: "string"},
      {name: "c", type: "string"}
    ],
    {
      "a:string": {isVisible: true},
      "b:string": {isVisible: true},
      "c:string": {isVisible: true}
    }
  )

  const state = store.dispatchAll([hideAllColumns(tableLayout)])

  const table = getTableLayouts(state)[tableId]

  expect(table["a:string"]).toEqual({isVisible: false})
  expect(table["b:string"]).toEqual({isVisible: false})
  expect(table["c:string"]).toEqual({isVisible: false})
})
