import {createError} from "./error"

test("server error", () => {
  const e = createError({kind: "Bad", error: "things can happen"})

  expect(e.toString()).toEqual("Bad: things can happen")
})

test("object error", () => {
  const e = createError({boom: "bang"})

  expect(e.boom).toEqual("bang")
  expect(e.toString()).toEqual("Error")
})

test("Error error", () => {
  const e = createError(new Error("my own error"))

  expect(e.toString()).toEqual("Error: my own error")
})

test("string error", () => {
  const e = createError("im a string")

  expect(e.toString()).toEqual("Error: im a string")
})

test("null error", () => {
  const e = createError(null)

  expect(e.toString()).toEqual("Error: null")
})
