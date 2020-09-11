import lib from "./"

test("too small", () => {
  expect(lib.bounded(-10, [1, 5])).toEqual(1)
})

test("too big", () => {
  expect(lib.bounded(100, [1, 5])).toEqual(5)
})

test("just right", () => {
  expect(lib.bounded(3, [1, 5])).toEqual(3)
})

test("bounds that are the same", () => {
  expect(lib.bounded(3, [0, 0])).toEqual(0)
})

test("bounds that are negative", () => {
  expect(lib.bounded(-3, [0, -5])).toEqual(0)
})
