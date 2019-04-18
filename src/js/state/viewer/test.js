/* @flow */

import {
  appendViewerLogs,
  clearViewer,
  setViewerStatus,
  spliceViewer
} from "./actions"
import {conn, dns, http} from "../../test/mockLogs"
import {getViewerLogs, getViewerStatus} from "./selector"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
  store.dispatchAll([])
})

test("adding logs to the viewer", () => {
  let state = store.dispatchAll([
    appendViewerLogs([conn(), dns()]),
    appendViewerLogs([http()])
  ])

  expect(getViewerLogs(state).length).toEqual(3)
})

test("clear results", () => {
  let state = store.dispatchAll([appendViewerLogs([http()]), clearViewer()])

  expect(getViewerLogs(state)).toEqual([])
})

test("splice results", () => {
  let state = store.dispatchAll([
    appendViewerLogs([http()]),
    appendViewerLogs([http()]),
    appendViewerLogs([http()]),
    spliceViewer(1)
  ])

  expect(getViewerLogs(state).length).toEqual(1)
})

test("results complete", () => {
  let state = store.dispatchAll([setViewerStatus("COMPLETE")])

  expect(getViewerStatus(state)).toBe("COMPLETE")
})

test("results incomplete", () => {
  let state = store.dispatchAll([setViewerStatus("INCOMPLETE")])

  expect(getViewerStatus(state)).toBe("INCOMPLETE")
})

test("results limitted", () => {
  let state = store.dispatchAll([setViewerStatus("LIMIT")])

  expect(getViewerStatus(state)).toBe("LIMIT")
})
