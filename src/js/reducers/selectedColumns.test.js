/* @flow */

import initStore from "../test/initStore"
import * as selectedColumns from "./selectedColumns"
import * as actions from "../actions/columns"

test("initialState getAll", () => {
  const store = initStore()
  const state = store.getState()

  expect(selectedColumns.getSelected(state)).toEqual([])
})

test("set selectedColumns", () => {
  const store = initStore()
  store.dispatch(actions.setColumns([{name: "_path", type: "string"}]))
  const state = store.getState()
  expect(selectedColumns.getSelected(state)).toEqual([
    {name: "_path", type: "string"}
  ])
})

test("toggle column adds column if it doesn't exist", () => {
  const store = initStore()
  const state = store.dispatchAll([
    actions.toggleColumn({name: "duration", type: "number"})
  ])

  expect(selectedColumns.getSelected(state)).toEqual([
    {name: "duration", type: "number"}
  ])
})

test.only("toggle column removes column if exists", () => {
  const store = initStore()
  const state = store.dispatchAll([
    actions.toggleColumn({name: "duration", type: "number"}),
    actions.toggleColumn({name: "duration", type: "number"})
  ])
  expect(selectedColumns.getSelected(state)).toEqual([])
})

describe("#createColumns", () => {
  let widths = {a: 22, default: 100}
  let all = [
    {name: "a", type: "string", td: "1"},
    {name: "b", type: "number", td: "1"}
  ]
  let visible = [{name: "b", type: "number"}]

  test("sets the td", () => {
    const cols = selectedColumns.createColumns(all, visible, widths)

    expect(cols.getAll().map(c => c.td)).toEqual(["1", "1"])
  })

  test("sets all selectedColumns", () => {
    const cols = selectedColumns.createColumns(all, visible, widths)

    expect(cols.getAll().map(c => c.name)).toEqual(["a", "b"])
  })

  test("sets visibility", () => {
    const cols = selectedColumns.createColumns(all, visible, widths)

    expect(cols.getAll().map(c => c.isVisible)).toEqual([false, true])
  })

  test("sets widths", () => {
    const cols = selectedColumns.createColumns(all, visible, widths)

    expect(cols.getAll().map(c => c.width)).toEqual([22, 100])
  })

  test("sets visible to all if visible is empty", () => {
    visible = []
    const cols = selectedColumns.createColumns(all, visible, widths)

    expect(cols.getAll().map(c => c.isVisible)).toEqual([true, true])
  })
})
