import time from "../brim/time"
import histogramInterval from "./histogramInterval"
import {DateTuple} from "./TimeWindow"

const start = new Date()

test("returns the proper format", () => {
  const end = time(start).add(5, "minutes").toDate()
  const timeWindow: DateTuple = [start, end]

  expect(histogramInterval(timeWindow)).toEqual({
    number: 1,
    unit: "second",
    roundingUnit: "second",
  })
})
