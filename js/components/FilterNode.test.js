import {shortenTimeWindow} from "./FilterNode"

test("shortenTimeWindow with a time window", () => {
  const result = shortenTimeWindow(
    "hi  (ts >= 1260368807.766000 and ts < 1260618780.582000) james"
  )
  expect(result).toEqual(expect.any(Array))
  expect(result.length).toBe(3)
})

test("shortenTimeWindow without a time window", () => {
  const result = shortenTimeWindow("hi james")
  expect(result).toBe("hi james")
})
