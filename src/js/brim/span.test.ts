import brim, {Span} from "./"

function spanOf(num, unit) {
  const from = brim.time({ns: 0, sec: 0}).toTs()
  return brim.span([
    from,
    brim
      .time(from)
      .add(num, unit)
      .toTs()
  ] as Span)
}
test("999 ms", () => {
  const span = spanOf(999, "ms")
  expect(span.shortFormat()).toEqual("999 ms")
})

test("11 sec", () => {
  const span = spanOf(11, "seconds")
  expect(span.shortFormat()).toEqual("11 sec")
})

test("12 min", () => {
  const span = spanOf(12, "minutes")
  expect(span.shortFormat()).toEqual("12 min")
})
test("13 hr", () => {
  const span = spanOf(13, "hours")
  expect(span.shortFormat()).toEqual("13 hr")
})

test("2 day", () => {
  const span = spanOf(2, "days")
  expect(span.shortFormat()).toEqual("2 day")
})

test("3 wk", () => {
  const span = spanOf(3, "weeks")
  expect(span.shortFormat()).toEqual("3 wk")
})

test("16 mth", () => {
  const span = spanOf(20, "weeks")
  expect(span.shortFormat()).toEqual("4 mth")
})

test("17 yr", () => {
  const span = spanOf(17.4, "years")
  expect(span.shortFormat()).toEqual("17 yr")
})
