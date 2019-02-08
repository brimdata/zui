/* @flow */

import initStore from "../test/initStore"
import {conn} from "../test/mockLogs"
import * as actions from "../actions/columnGroups"
import {getColumnGroup} from "../selectors/columnGroups"

let store, descriptor
beforeEach(() => {
  store = initStore()
  descriptor = conn().descriptor
})

test("#setColumnsFromDescriptor", () => {
  store.dispatch(actions.setColumnsFromDescriptor("conn", descriptor))
  const state = store.getState()

  expect(getColumnGroup(state, "conn")).toHaveLength(descriptor.length)
})

test("#setColumnsFromDescriptor replaces old columns", () => {
  const a = {name: "a", type: "string"}
  const b = {name: "b", type: "string"}
  const c = {name: "c", type: "string"}
  const cInt = {name: "cInt", type: "integer"}

  const state = store.dispatchAll([
    actions.setColumnsFromDescriptor("conn", [a, b]),
    actions.setColumnsFromDescriptor("conn", [c, cInt])
  ])

  expect(getColumnGroup(state, "conn").map(c => c.name)).toEqual(["c", "cInt"])
})

test("#setColumnsFromDescriptor maintains width, visibility", () => {
  const a = {name: "a", type: "string"}
  const b = {name: "b", type: "string"}

  const state = store.dispatchAll([
    actions.setColumnsFromDescriptor("conn", [a, b]),
    actions.setColumnVisibility("conn", 0, false),
    actions.setColumnWidths("conn", {a: 999}),
    actions.setColumnsFromDescriptor("conn", [a, b])
  ])

  expect(getColumnGroup(state, "conn")).toEqual([
    {isVisible: false, name: "a", type: "string", width: 999},
    {isVisible: true, name: "b", type: "string", width: undefined}
  ])
})

test("#setColumnWidths", () => {
  const state = store.dispatchAll([
    actions.setColumnsFromDescriptor("conn", descriptor),
    actions.setColumnWidths("conn", {_path: 100, duration: 200})
  ])
  const columns = getColumnGroup(state, "conn")

  expect(columns.find(c => c.name === "_path")).toEqual(
    expect.objectContaining({width: 100})
  )

  expect(columns.find(c => c.name === "duration")).toEqual(
    expect.objectContaining({width: 200})
  )

  expect(columns.find(c => c.name === "conn_state")).toEqual(
    expect.objectContaining({width: undefined})
  )
})

test("#setColumnVisibility", () => {
  const state = store.dispatchAll([
    actions.setColumnsFromDescriptor("conn", descriptor),
    actions.setColumnVisibility("conn", 0, false),
    actions.setColumnVisibility("conn", 1, true)
  ])

  const columns = getColumnGroup(state, "conn")

  expect(columns[0].isVisible).toBe(false)
  expect(columns[1].isVisible).toBe(true)
})
