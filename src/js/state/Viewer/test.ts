/**
 * @jest-environment jsdom
 */

import {createRecord} from "src/test/shared/factories/zed-factory"
import initTestStore from "src/test/unit/helpers/initTestStore"
import Tabs from "../Tabs"
import Viewer from "../Viewer"

let store
let tabId
beforeEach(() => {
  store = initTestStore()
  store.dispatchAll([])
  tabId = Tabs.getActive(store.getState())
})

const conn = createRecord({ts: new Date(1000)})
const dns = createRecord({ts: new Date(2000)})
const http = createRecord({ts: new Date(3000)})

test("adding logs to the viewer", () => {
  const state = store.dispatchAll([
    Viewer.appendRecords(tabId, [conn, dns]),
    Viewer.appendRecords(tabId, [http]),
  ])

  expect(Viewer.getLogs(state).length).toEqual(3)
})

test("clear results", () => {
  const state = store.dispatchAll([
    Viewer.appendRecords(tabId, [http]),
    Viewer.clear(tabId),
  ])

  expect(Viewer.getLogs(state)).toEqual([])
})

test("splice results", () => {
  const state = store.dispatchAll([
    Viewer.appendRecords(tabId, [http]),
    Viewer.appendRecords(tabId, [http]),
    Viewer.appendRecords(tabId, [http]),
    Viewer.splice(tabId, 1),
  ])

  expect(Viewer.getLogs(state).length).toEqual(1)
})

test("results complete", () => {
  const state = store.dispatchAll([Viewer.setEndStatus(tabId, "COMPLETE")])

  expect(Viewer.getEndStatus(state)).toBe("COMPLETE")
})

test("set search key", () => {
  const state = store.dispatchAll([Viewer.setSearchKey(tabId, "testKey")])

  expect(Viewer.getSearchKey(state)).toBe("testKey")
})

test("results incomplete", () => {
  const state = store.dispatchAll([Viewer.setEndStatus(tabId, "INCOMPLETE")])

  expect(Viewer.getEndStatus(state)).toBe("INCOMPLETE")
})

test("results limited", () => {
  const state = store.dispatchAll([Viewer.setEndStatus(tabId, "LIMIT")])

  expect(Viewer.getEndStatus(state)).toBe("LIMIT")
})
