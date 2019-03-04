import lookytalkVersion from "./lookytalkVersion"

test("version", () => {
  expect(lookytalkVersion()).toMatch(/v\d+\.\d+\.\d+/)
})
