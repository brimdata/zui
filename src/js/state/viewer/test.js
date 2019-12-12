/* @flow */

import {
  appendViewerRecords,
  clearViewer,
  setViewerEndStatus,
  spliceViewer,
  updateViewerColumns
} from "./actions"
import {conn, dns, http} from "../../test/mockLogs"
import {getViewerColumns, getViewerEndStatus, getViewerLogs} from "./selector"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
  store.dispatchAll([])
})

test("adding logs to the viewer", () => {
  let state = store.dispatchAll([
    appendViewerRecords([conn(), dns()]),
    appendViewerRecords([http()])
  ])

  expect(getViewerLogs(state).length).toEqual(3)
})

test("clear results", () => {
  let state = store.dispatchAll([appendViewerRecords([http()]), clearViewer()])

  expect(getViewerLogs(state)).toEqual([])
})

test("splice results", () => {
  let state = store.dispatchAll([
    appendViewerRecords([http()]),
    appendViewerRecords([http()]),
    appendViewerRecords([http()]),
    spliceViewer(1)
  ])

  expect(getViewerLogs(state).length).toEqual(1)
})

test("results complete", () => {
  let state = store.dispatchAll([setViewerEndStatus("COMPLETE")])

  expect(getViewerEndStatus(state)).toBe("COMPLETE")
})

test("results incomplete", () => {
  let state = store.dispatchAll([setViewerEndStatus("INCOMPLETE")])

  expect(getViewerEndStatus(state)).toBe("INCOMPLETE")
})

test("results limited", () => {
  let state = store.dispatchAll([setViewerEndStatus("LIMIT")])

  expect(getViewerEndStatus(state)).toBe("LIMIT")
})

test("update columns with same tds", () => {
  let descriptor1 = {"1": [{name: "hello", type: "string"}]}
  let descriptor2 = {"1": [{name: "world", type: "string"}]}
  let state = store.dispatchAll([
    updateViewerColumns(descriptor1),
    updateViewerColumns(descriptor2)
  ])

  expect(getViewerColumns(state)).toEqual({
    "9d14c2039a78d76760aae879c7fd2c82": [{name: "hello", type: "string"}],
    "71f1b421963d31952e15edf7e3957a81": [{name: "world", type: "string"}]
  })
})
