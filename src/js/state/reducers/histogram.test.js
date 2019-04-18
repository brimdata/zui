/* @flow */

import {clearHistogram, histogramSearchResult} from "../actions"
import {createHistogramData} from "../../charts/createHistogramData"
import {getHistogramData} from "./histogram"
import {histogramLogs} from "../../test/mockPayloads"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})
const data = histogramLogs()

test("receive data", () => {
  const state = store.dispatchAll([histogramSearchResult(data)])

  expect(getHistogramData(state)).toEqual(data)
})

test("receive data twice", () => {
  const state = store.dispatchAll([
    histogramSearchResult(data),
    histogramSearchResult(data)
  ])

  expect(getHistogramData(state)).toEqual(data)
})

test("#createHistogramData", () => {
  const timeWindow = [
    new Date("2017-09-18T03:29:23.074Z"),
    new Date("2018-05-18T14:47:15.016Z")
  ]

  const result = createHistogramData(histogramLogs(), timeWindow)
  const sum = result.data.reduce((sum, d) => (sum += d.count), 0)
  expect(sum).toBe(3)
  expect(result.keys).toEqual(["dns", "conn"])
})

test("clearing the count by time data", () => {
  const state = store.dispatchAll([
    histogramSearchResult(histogramLogs()),
    clearHistogram()
  ])

  expect(getHistogramData(state)).toEqual([])
})
