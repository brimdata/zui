/* @flow */

import {getCountByTimeData, formatHistogram} from "./countByTime"
import * as a from "../actions/countByTime"
import initStore from "../test/initStore"

let store
beforeEach(() => {
  store = initStore()
})

test("receive data", () => {
  const data = {
    tuples: [["1"], ["2"]],
    descriptor: [{type: "integer", name: "count"}]
  }
  const state = store.dispatchAll([a.receiveCountByTime(data)])

  expect(getCountByTimeData(state)).toEqual(data)
})

test("receive data twice", () => {
  const data = {
    tuples: [["1"], ["2"]],
    descriptor: [{type: "integer", name: "count"}]
  }
  const state = store.dispatchAll([
    a.receiveCountByTime(data),
    a.receiveCountByTime(data)
  ])

  expect(getCountByTimeData(state)).toEqual({
    tuples: [["1"], ["2"], ["1"], ["2"]],
    descriptor: [{type: "integer", name: "count"}]
  })
})

test("#formatHistogram", () => {
  const timeWindow = [
    new Date("2017-09-18T03:29:23.074Z"),
    new Date("2018-05-18T14:47:15.016Z")
  ]
  const data = {
    descriptor: [
      {name: "_path", type: "string"},
      {name: "count", type: "count"}
    ],
    tuples: [["1510185600000000000", "conn", "37179"]]
  }
  const result = formatHistogram(timeWindow, data)
  const sum = result.data.reduce((sum, d) => (sum += d.count), 0)
  expect(sum).toBe(37179)
  expect(result.keys).toEqual(["conn"])
})

test("clearing the count by time data", () => {
  const data = {
    tuples: [["1"], ["2"]],
    descriptor: [{type: "integer", name: "count"}]
  }
  const state = store.dispatchAll([
    a.receiveCountByTime(data),
    a.clearCountByTime()
  ])

  expect(getCountByTimeData(state)).toEqual({tuples: [], descriptor: []})
})
