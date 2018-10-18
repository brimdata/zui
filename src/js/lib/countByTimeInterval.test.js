/* @flow */

import countByTimeInterval from "./countByTimeInterval"
import * as Time from "../lib/Time"

const start = new Date()

test("returns the proper format", () => {
  const end = Time.add(start, 5, "minutes")
  const timeWindow = [start, end]

  expect(countByTimeInterval(timeWindow)).toEqual({
    number: 1,
    unit: "second",
    roundingUnit: "second"
  })
})
