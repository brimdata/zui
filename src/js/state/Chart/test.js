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
  [
    {name: "ts", type: "string", value: "0"},
    {name: "_path", type: "string", value: "conn"},
    {name: "count", type: "string", value: "500"}
  ],
  [
    {name: "ts", type: "string", value: "100"},
    {name: "_path", type: "string", value: "dns"},
    {name: "count", type: "string", value: "300"}
  ]
]

test("chart records append", () => {
  let state = store.dispatchAll([
    chart.appendRecords(tabId, [records[0]]),
    chart.appendRecords(tabId, [records[1]])
  ])

  expect(chart.getData(state)).toEqual({
    keys: ["conn", "dns"],
    table: {"0": {conn: 500}, "100000": {dns: 300}}
  })
})

test("chart records remains unique", () => {
  let state = store.dispatchAll([
    chart.appendRecords(tabId, [records[0]]),
    chart.appendRecords(tabId, [records[0]])
  ])

  expect(chart.getData(state)).toEqual({
    keys: ["conn"],
    table: {"0": {conn: 500}}
  })
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
  expect(chart.getData(state)).toEqual({keys: [], table: {}})
})
