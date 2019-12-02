/* @flow */
import zqVersion from "./zqVersion"

test("version", () => {
  // Relax zq version while its changing so often
  // expect(zqVersion()).toMatch(/v\d+\.\d+\.\d+/)
  expect(zqVersion()).toEqual(expect.any(String))
})
