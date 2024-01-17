import {getTimeString} from "./get-time-string"

test("getTimeString", () => {
  const input = "2020-02-25T08:03:05.983Z"
  const output = getTimeString(input, "UTC")
  expect(output).toBe(input)
})
