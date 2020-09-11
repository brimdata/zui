import brim from "./"

test("date to ts", () => {
  const ts = brim.time(new Date(1)).toTs()

  expect(ts).toEqual({
    ns: 1000000,
    sec: 0
  })

  expect(brim.time(ts).toDate()).toEqual(new Date(1))
})

test("add", () => {
  const ts = brim
    .time(new Date(1))
    .add(1, "ms")
    .toTs()

  expect(ts).toEqual({
    ns: 2000000,
    sec: 0
  })
})

test("subtract", () => {
  const ts = brim
    .time(new Date(1))
    .subtract(1, "second")
    .toTs()

  expect(ts).toEqual({
    ns: 1000000,
    sec: -1
  })
})
