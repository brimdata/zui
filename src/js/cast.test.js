import * as Time from "./lib/Time"
import * as cast from "./cast"

test("fromNanoTsToDate", () => {
  expect(cast.fromNanoTsToDate("1427068800000000000")).toEqual(
    new Date("2015-03-23T00:00:00.000Z")
  )
})

test("fromNanoTsToMoment", () => {
  expect(cast.fromNanoTsToMoment("1427068800000000000").format()).toEqual(
    Time.parse("2015-03-23T00:00:00.000Z").format()
  )
})
