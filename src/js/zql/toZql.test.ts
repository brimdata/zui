import {toFieldPath} from "./toZql"

test("toZql correctly formats fieldPaths", () => {
  expect(toFieldPath(["one", "two", "three"])).toBe("one.two.three")
  expect(toFieldPath(["one", "two", "$ three"])).toBe('one.two["$ three"]')
  expect(toFieldPath(["_ 1", "two", "$ 3"])).toBe('this["_ 1"].two["$ 3"]')
  expect(toFieldPath(["$1", "two @", "three !"])).toBe('$1["two @"]["three !"]')
  expect(toFieldPath(" my name is bill")).toBe('this[" my name is bill"]')
})
