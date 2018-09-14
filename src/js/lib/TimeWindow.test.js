import * as TimeWindow from "./TimeWindow"

test("duration as seconds", () => {
  const window = [
    new Date(2000, 1, 15, 12, 30, 0),
    new Date(2000, 1, 15, 12, 30, 45)
  ]
  const duration = TimeWindow.duration(window, "seconds")

  expect(duration).toBe(45)
})

test("duration as ms", () => {
  const window = [
    new Date(2000, 1, 15, 12, 30, 0, 0),
    new Date(2000, 1, 15, 12, 30, 45, 0)
  ]
  const duration = TimeWindow.duration(window, "ms")

  expect(duration).toBe(45000)
})

test("humanDuration", () => {
  const window = [
    new Date(2000, 1, 15, 12, 30, 0, 0),
    new Date(2000, 1, 15, 15, 30, 45, 0)
  ]
  const duration = TimeWindow.humanDuration(window)

  expect(duration).toBe("3 hours")
})

test("inSameUnit", () => {
  const window = [
    new Date(2000, 1, 15, 12, 30, 0, 0),
    new Date(2000, 1, 15, 15, 30, 45, 0)
  ]
  const duration = TimeWindow.inSameUnit(window, "second")

  expect(duration).toBe(false)
})

test("inSameUnit", () => {
  const window = [
    new Date(2000, 1, 15, 12, 30, 0, 0),
    new Date(2000, 1, 15, 15, 30, 45, 0)
  ]
  const duration = TimeWindow.inSameUnit(window, "month")

  expect(duration).toBe(true)
})

test("floorAndCeil", () => {
  const window = [
    new Date(2000, 1, 15, 12, 30, 0, 0),
    new Date(2000, 1, 15, 13, 30, 45, 0)
  ]

  const newWindow = TimeWindow.floorAndCeil(window, "minute")

  expect(newWindow).toEqual([
    new Date(2000, 1, 15, 12, 30, 0, 0),
    new Date(2000, 1, 15, 13, 30, 59, 999)
  ])
})

test("shift forward", () => {
  const window = [
    new Date(2000, 1, 15, 12, 30, 0, 0),
    new Date(2000, 1, 15, 13, 30, 45, 0)
  ]

  const newWindow = TimeWindow.shift(window, 1000)

  expect(newWindow).toEqual([
    new Date(2000, 1, 15, 12, 30, 1, 0),
    new Date(2000, 1, 15, 13, 30, 46, 0)
  ])
})

test("shift backwards", () => {
  const window = [
    new Date(2000, 1, 15, 12, 30, 0, 0),
    new Date(2000, 1, 15, 13, 30, 45, 0)
  ]

  const newWindow = TimeWindow.shift(window, -1, "seconds")

  expect(newWindow).toEqual([
    new Date(2000, 1, 15, 12, 29, 59, 0),
    new Date(2000, 1, 15, 13, 30, 44, 0)
  ])
})
