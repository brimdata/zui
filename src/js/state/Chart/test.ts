import {createRecord} from "test/shared/factories/zed-factory"
import initTestStore from "../../../../test/unit/helpers/initTestStore"
import Tabs from "../Tabs"
import chart from "./"

let store, tabId
beforeEach(() => {
  store = initTestStore()
  tabId = Tabs.getActive(store.getState())
})

const records = [
  createRecord({ts: new Date(0), _path: "conn", count: 500}),
  createRecord({ts: new Date(100 * 1000), _path: "dns", count: 300})
]

test("chart records append", () => {
  const state = store.dispatchAll([
    chart.appendRecords(tabId, [records[0]]),
    chart.appendRecords(tabId, [records[1]])
  ])

  expect(chart.getData(state)).toEqual({
    keys: ["conn", "dns"],
    table: {"0": {conn: 500}, "100000": {dns: 300}}
  })
})

test("chart records remains unique", () => {
  const state = store.dispatchAll([
    chart.appendRecords(tabId, [records[0]]),
    chart.appendRecords(tabId, [records[0]])
  ])

  expect(chart.getData(state)).toEqual({
    keys: ["conn"],
    table: {"0": {conn: 500}}
  })
})

test("chart records status", () => {
  const state = store.dispatchAll([chart.setStatus(tabId, "SUCCESS")])

  expect(chart.getStatus(state)).toBe("SUCCESS")
})

test("chart records clear", () => {
  const state = store.dispatchAll([
    chart.appendRecords(tabId, records),
    chart.setStatus(tabId, "SUCCESS"),
    chart.clear(tabId)
  ])

  expect(chart.getStatus(state)).toBe("INIT")
  expect(chart.getData(state)).toEqual({keys: [], table: {}})
})
