import countByTimeInterval from "./countByTimeInterval"
import * as Time from "./lib/Time"

const start = Time.parse()

test("returns the proper format", () => {
  const end = start.clone().add(5, "minutes")
  const timeWindow = [start.toDate(), end.toDate()]

  expect(countByTimeInterval(timeWindow)).toEqual({
    number: 1,
    unit: "second",
    roundingUnit: "second"
  })
})
