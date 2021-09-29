import {toFieldPath} from "./toZql"

test("toZql correctly formats fieldPaths", () => {
  expect(toFieldPath({path: ["one", "two", "three"]})).toBe("one.two.three")
  expect(toFieldPath({path: ["one", "two", "$ three"]})).toBe(
    'one.two["$ three"]'
  )
  expect(toFieldPath({path: ["_ 1", "two", "$ 3"]})).toBe(
    'this["_ 1"].two["$ 3"]'
  )
  expect(toFieldPath({path: ["$1", "two @", "three !"]})).toBe(
    '$1["two @"]["three !"]'
  )
})
