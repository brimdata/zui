/* @flow */

import {createHistogramData} from "./createHistogramData"
import {histogramLogs} from "../test/mockPayloads"

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
