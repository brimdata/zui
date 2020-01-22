/* @flow */

import Tabs from "../Tabs"
import chart from "./"
import initTestStore from "../../test/initTestStore"

let store, tabId
beforeEach(() => {
  store = initTestStore()
  tabId = Tabs.getActive(store.getState())
})

let records = [
  [{name: "id", type: "string", value: "1"}],
  [{name: "id", type: "string", value: "2"}]
]

test("chart records append", () => {
  let state = store.dispatchAll([
    chart.appendRecords(tabId, [records[0]]),
    chart.appendRecords(tabId, [records[1]])
  ])

  expect(chart.getRecords(state)).toEqual(records)
})

test("chart records status", () => {
  let state = store.dispatchAll([chart.setStatus(tabId, "SUCCESS")])

  expect(chart.getStatus(state)).toBe("SUCCESS")
})

test("chart records clear", () => {
  let state = store.dispatchAll([
    chart.appendRecords(tabId, records),
    chart.setStatus(tabId, "SUCCESS"),
    chart.clear(tabId)
  ])

  expect(chart.getStatus(state)).toBe("INIT")
  expect(chart.getRecords(state)).toEqual([])
})
