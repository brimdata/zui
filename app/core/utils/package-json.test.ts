import packageJSON from "./package-json"

test("name", () => {
  expect(packageJSON.name).toBe("Brim")
})
