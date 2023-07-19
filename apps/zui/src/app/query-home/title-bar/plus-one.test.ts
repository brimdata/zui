import {plusOne} from "./plus-one"

test("plus one", () => {
  expect(plusOne("James")).toBe("James 2")
})

test("James 2", () => {
  expect(plusOne("James 2")).toBe("James 3")
})

test("James 2.2", () => {
  expect(plusOne("James 2.2")).toBe("James 2.3")
})

test("empty", () => {
  expect(plusOne("")).toBe("")
})
