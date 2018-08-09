import * as format from "./timeWindowFormatter"

const timeWindow = [new Date("1990-09-16"), new Date("1990-09-17")]

test("humanDuration", () => {
  expect(format.humanDuration(timeWindow)).toBe("a day")
})
