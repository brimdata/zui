import {extract} from "./object"

test("extract properties that exist", () => {
  const obj = {name: "james", age: 24, colors: ["blue", "green"]}
  const newObj = extract(obj, "name", "colors")

  expect(obj).toEqual({age: 24})
  expect(newObj).toEqual({name: "james", colors: ["blue", "green"]})
})

test("extract keys that don't exist", () => {
  const obj = {name: "james", age: 24, colors: ["blue", "green"]}
  const newObj = extract(obj, "a", "b", "c", "name")

  expect(newObj).toEqual({name: "james"})
  expect(obj).toEqual({age: 24, colors: ["blue", "green"]})
})
