import AppError from "./AppError"

test("a raw error with a message field", () => {
  let raw = {type: "Error", message: "Sort limit reached (10)"}

  expect(new AppError(raw).message()).toBe("Sort limit reached (10)")
})
