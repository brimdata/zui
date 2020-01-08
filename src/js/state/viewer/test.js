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
import tabs from "../tabs"

let store
let tabId
beforeEach(() => {
  store = initTestStore()
  store.dispatchAll([])
  tabId = tabs.getActive(store.getState())
})

test("adding logs to the viewer", () => {
  let state = store.dispatchAll([
    appendViewerRecords(tabId, [conn(), dns()]),
    appendViewerRecords(tabId, [http()])
  ])

  expect(getViewerLogs(state).length).toEqual(3)
})

test("clear results", () => {
  let state = store.dispatchAll([
    appendViewerRecords(tabId, [http()]),
    clearViewer(tabId)
  ])

  expect(getViewerLogs(state)).toEqual([])
})

test("splice results", () => {
  let state = store.dispatchAll([
    appendViewerRecords(tabId, [http()]),
    appendViewerRecords(tabId, [http()]),
    appendViewerRecords(tabId, [http()]),
    spliceViewer(tabId, 1)
  ])

  expect(getViewerLogs(state).length).toEqual(1)
})

test("results complete", () => {
  let state = store.dispatchAll([setViewerEndStatus(tabId, "COMPLETE")])

  expect(getViewerEndStatus(state)).toBe("COMPLETE")
})

test("results incomplete", () => {
  let state = store.dispatchAll([setViewerEndStatus(tabId, "INCOMPLETE")])

  expect(getViewerEndStatus(state)).toBe("INCOMPLETE")
})

test("results limited", () => {
  let state = store.dispatchAll([setViewerEndStatus(tabId, "LIMIT")])

  expect(getViewerEndStatus(state)).toBe("LIMIT")
})

test("update columns with same tds", () => {
  let descriptor1 = {"1": [{name: "hello", type: "string"}]}
  let descriptor2 = {"1": [{name: "world", type: "string"}]}
  let state = store.dispatchAll([
    updateViewerColumns(tabId, descriptor1),
    updateViewerColumns(tabId, descriptor2)
  ])

  expect(getViewerColumns(state)).toEqual({
    "9d14c2039a78d76760aae879c7fd2c82": [{name: "hello", type: "string"}],
    "71f1b421963d31952e15edf7e3957a81": [{name: "world", type: "string"}]
  })
})
