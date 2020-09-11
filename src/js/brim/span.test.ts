import brim, {Span} from "./"

function spanOf(num, unit) {
  let from = brim.time({ns: 0, sec: 0}).toTs()
  return brim.span([
    from,
    brim
      .time(from)
      .add(num, unit)
      .toTs()
  ] as Span)
}
test("999 ms", () => {
  let span = spanOf(999, "ms")
  expect(span.shortFormat()).toEqual("999 ms")
})

test("11 sec", () => {
  let span = spanOf(11, "seconds")
  expect(span.shortFormat()).toEqual("11 sec")
})

test("12 min", () => {
  let span = spanOf(12, "minutes")
  expect(span.shortFormat()).toEqual("12 min")
})
test("13 hr", () => {
  let span = spanOf(13, "hours")
  expect(span.shortFormat()).toEqual("13 hr")
})

test("2 day", () => {
  let span = spanOf(2, "days")
  expect(span.shortFormat()).toEqual("2 day")
})

test("3 wk", () => {
  let span = spanOf(3, "weeks")
  expect(span.shortFormat()).toEqual("3 wk")
})

test("16 mth", () => {
  let span = spanOf(20, "weeks")
  expect(span.shortFormat()).toEqual("4 mth")
})

test("17 yr", () => {
  let span = spanOf(17.4, "years")
  expect(span.shortFormat()).toEqual("17 yr")
})
