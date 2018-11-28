/* @flow */

import initStore from "../test/initStore"
import * as columns from "./columns"
import * as actions from "../actions/columns"

test("initialState getAll", () => {
  const store = initStore()
  const state = store.getState()

  expect(columns.getAll(state)).toEqual([])
})

test("set columns", () => {
  const store = initStore()
  store.dispatch(actions.setColumns([{name: "_path", type: "string"}]))
  const state = store.getState()
  expect(columns.getAll(state)).toEqual([{name: "_path", type: "string"}])
})

test("toggle column adds column if it doesn't exist", () => {
  const store = initStore()
  const state = store.dispatchAll([
    actions.toggleColumn({name: "duration", type: "number"})
  ])

  expect(columns.getAll(state)).toEqual([{name: "duration", type: "number"}])
})

test("toggle column removes column if exists", () => {
  const store = initStore()
  const state = store.dispatchAll([
    actions.toggleColumn({name: "duration", type: "number"}),
    actions.toggleColumn({name: "duration", type: "number"})
  ])
  expect(columns.getAll(state)).toEqual([])
})

describe("#createColumns", () => {
  let widths = {a: 22, default: 100}
  let tds = ["1"]
  let all = [{name: "a", type: "string"}, {name: "b", type: "number"}]
  let visible = [{name: "b", type: "number"}]

  test("sets all columns", () => {
    const cols = columns.createColumns(tds, all, visible, widths)

    expect(cols.getAll().map(c => c.name)).toEqual(["a", "b"])
  })

  test("sets visibility", () => {
    const cols = columns.createColumns(tds, all, visible, widths)

    expect(cols.getAll().map(c => c.isVisible)).toEqual([false, true])
  })

  test("sets widths", () => {
    const cols = columns.createColumns(tds, all, visible, widths)

    expect(cols.getAll().map(c => c.width)).toEqual([22, 100])
  })

  test("sets visible to all if visible is empty", () => {
    visible = []
    const cols = columns.createColumns(tds, all, visible, widths)

    expect(cols.getAll().map(c => c.isVisible)).toEqual([true, true])
  })
})
