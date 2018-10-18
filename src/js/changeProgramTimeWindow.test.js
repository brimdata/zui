import {
  containsTimeWindow,
  changeProgramTimeWindow,
  extractLastTimeWindow
} from "./changeProgramTimeWindow"
import * as Time from "./lib/Time"

test("changeProgramTimeWindow", () => {
  const program = "ts >= 1260815710.426274 AND ts < 1260815710.426274"
  const newTimeWindow = [new Date("2018-10-10"), new Date("2018-10-20")]

  const newProgram = changeProgramTimeWindow(program, newTimeWindow)

  expect(newProgram).toBe("ts >= 1539129600.000000 AND ts < 1539993600.000000")
})

test("changeProgramTimeWindow when out of order", () => {
  const program = "ts < 1260815710.426274 AND ts >= 1260815710.426274"
  const newTimeWindow = [new Date("2018-10-10"), new Date("2018-10-20")]

  const newProgram = changeProgramTimeWindow(program, newTimeWindow)

  expect(newProgram).toBe("ts < 1539993600.000000 AND ts >= 1539129600.000000")
})

test("changeProgramTimeWindow with other filters", () => {
  const program =
    "path=conn ts >= 1260815710.426274 AND (ts < 1260815710.426274) dns"
  const newTimeWindow = [new Date("2018-10-10"), new Date("2018-10-20")]

  const newProgram = changeProgramTimeWindow(program, newTimeWindow)

  expect(newProgram).toBe(
    "path=conn ts >= 1539129600.000000 AND (ts < 1539993600.000000) dns"
  )
})

test("changeProgramTimeWindow does not mutate program", () => {
  const program =
    "path=conn ts >= 1260815710.426274 AND (ts < 1260815710.426274) dns"
  const newTimeWindow = [new Date("2018-10-10"), new Date("2018-10-20")]

  const newProgram = changeProgramTimeWindow(program, newTimeWindow)

  expect(program).not.toBe(newProgram)
})

test("containsTimeWindow when true", () => {
  const program = "(ts >= 1260815710.426274 AND ts < 1260815710.426274)"

  expect(containsTimeWindow(program)).toBe(true)
})

test("containsTimeWindow without parens", () => {
  const program = "ts >= 1260815710.426274 AND ts < 1260815710.426274"

  expect(containsTimeWindow(program)).toBe(true)
})

test("containsTimeWindow when at the end of program", () => {
  const program =
    "http GET (ts >= 1260815710.426274 AND ts < 1260815710.426274)"

  expect(containsTimeWindow(program)).toBe(true)
})

test("containsTimeWindow at random places", () => {
  const program = "http ts >= 1260815710.426274 GET (ts < 1260815710.426274)"

  expect(containsTimeWindow(program)).toBe(true)
})

test("containsTimeWindow when false", () => {
  const program = "_path=conn"

  expect(containsTimeWindow(program)).toBe(false)
})

test("extractLastTimeWindow", () => {
  const program = "ts >= 1260815710.426274 AND ts < 1260815710.426274"

  expect(extractLastTimeWindow(program)).toEqual([
    toDate("1260815710.426274"),
    toDate("1260815710.426274")
  ])
})

test("extractLastTimeWindow when more than one", () => {
  const program =
    "ts >= 121212121212.343434 AND ts < 121212121212.343434 ts >= 565656565656.787878 AND _path=conn AND ts < 565656565656.787878 dns"

  expect(extractLastTimeWindow(program)).toEqual([
    toDate("565656565656.787878"),
    toDate("565656565656.787878")
  ])
})

test("extractLastTimeWindow when none", () => {
  const program = "dns"

  expect(extractLastTimeWindow(program)).toBe(null)
})

function toDate(string) {
  return Time.parse(string, "X.SSSSSS", false)
}
