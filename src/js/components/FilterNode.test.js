import {shortenTimeWindow} from "./FilterNode"

test("shortenTimeWindow with a time window", () => {
  const result = shortenTimeWindow(
    "hi  (ts >= 1260368807.766000 and ts < 1260618780.582000) james"
  )
  expect(result).toEqual(expect.any(Array))
  expect(result.length).toBe(3)
  expect(result[1].props.title).toEqual("Dec 9, 06:26 - Dec 12, 03:53")
})

test("shortenTimeWindow without a time window", () => {
  const result = shortenTimeWindow("hi james")
  expect(result).toBe("hi james")
})
