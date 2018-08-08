import moment from "moment"
import countByTimeInterval from "./countByTimeInterval"

const start = moment()

test("returns the proper format", () => {
  const end = start.clone().add(5, "minutes")
  const timeWindow = [start.toDate(), end.toDate()]

  expect(countByTimeInterval(timeWindow)).toEqual({
    number: 1,
    unit: "second",
    roundingUnit: "second"
  })
})
