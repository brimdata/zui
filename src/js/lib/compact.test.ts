import lib from "./"

test("compact", () => {
  expect(lib.compact([null, false, undefined, "", NaN, "james", {}])).toEqual([
    "james",
    {}
  ])
})
