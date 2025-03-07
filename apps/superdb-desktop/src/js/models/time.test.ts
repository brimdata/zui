import time from "./time"

test("date to ts", () => {
  const ts = time(new Date(1)).toTs()

  expect(ts).toEqual({
    ns: 1000000,
    sec: 0,
  })

  expect(time(ts).toDate()).toEqual(new Date(1))
})

test("add", () => {
  const ts = time(new Date(1)).add(1, "ms").toTs()

  expect(ts).toEqual({
    ns: 2000000,
    sec: 0,
  })
})

test("subtract", () => {
  const ts = time(new Date(1)).subtract(1, "second").toTs()

  expect(ts).toEqual({
    ns: 1000000,
    sec: -1,
  })
})

test("relative time", () => {
  const ts = time("now - 1y").toTs()

  expect(ts).toEqual({
    ns: expect.any(Number),
    sec: expect.any(Number),
  })
})
