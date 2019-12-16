/* @flow */

import chart from "./"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

let records = [
  [{name: "id", type: "string", value: "1"}],
  [{name: "id", type: "string", value: "2"}]
]

test("chart records append", () => {
  let state = store.dispatchAll([
    chart.appendRecords([records[0]]),
    chart.appendRecords([records[1]])
  ])

  expect(chart.getRecords(state)).toEqual(records)
})

test("chart records status", () => {
  let state = store.dispatchAll([chart.setStatus("SUCCESS")])

  expect(chart.getStatus(state)).toBe("SUCCESS")
})

test("chart records clear", () => {
  let state = store.dispatchAll([
    chart.appendRecords(records),
    chart.setStatus("SUCCESS"),
    chart.clear()
  ])

  expect(chart.getStatus(state)).toBe("INIT")
  expect(chart.getRecords(state)).toEqual([])
})
