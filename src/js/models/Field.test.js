/* @flow */

import Field from "./Field"

test("toString", () => {
  let a = new Field({name: "id.resp_h", type: "addr", value: "1::1::"})

  expect(a.toString()).toBe("id.resp_h:addr	1::1::")
})

test("to a string and back again", () => {
  let a = new Field({name: "id.resp_h", type: "addr", value: "1::1::"})
  let b = Field.fromString(a.toString())

  expect(a).toEqual(b)
})
