/* @flow */
import brim from "./brim"

test("describe conn uid", () => {
  let path = brim.zeekLogInfo("conn")
  let desc = path.describeColumn("uid")

  expect(desc).toBe("A unique identifier of the connection.")
})

test("known path", () => {
  let path = brim.zeekLogInfo("conn")

  expect(path.isKnown()).toBe(true)
})

test("unknown path", () => {
  let path = brim.zeekLogInfo("nopath")
  expect(path.isKnown()).toBe(false)
})
