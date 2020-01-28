/* @flow */
import ZeekDocs from "./"

test("describe conn uid", () => {
  let desc = ZeekDocs.describe("conn", "uid", "string")

  expect(desc).toBe("A unique identifier of the connection.")
})
