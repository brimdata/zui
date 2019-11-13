/* @flow */
import zqVersion from "./zqVersion"

test("version", () => {
  expect(zqVersion()).toMatch(/v\d+\.\d+\.\d+/)
})
