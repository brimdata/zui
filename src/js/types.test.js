import * as types from "./cast"

test("toTs", () => {
  const date = new Date("2018-01-01")
  const ts = "1514764800.000000"

  expect(types.toTs(date)).toBe(ts)
})

test("toDate", () => {
  const date = new Date("2018-01-01")
  const ts = "1514764800.000000"

  expect(types.toDate(ts)).toEqual(date)
})
