/* @flow */

import Log from "./Log"

test("isSame when they are the same", () => {
  const a = new Log(
    ["1", "conn"],
    [{type: "integer", name: "td"}, {type: "string", name: "_path"}]
  )
  const b = new Log(
    ["1", "conn"],
    [{type: "integer", name: "td"}, {type: "string", name: "_path"}]
  )
  expect(Log.isSame(a, b)).toBe(true)
})

test("isSame when they are different", () => {
  const a = new Log(
    ["1", "conn"],
    [{type: "integer", name: "td"}, {type: "string", name: "_path"}]
  )
  const b = new Log(
    ["2", "conn"],
    [{type: "integer", name: "td"}, {type: "string", name: "_path"}]
  )
  expect(Log.isSame(a, b)).toBe(false)
})

test("isSame when they are different", () => {
  const a = new Log(
    ["1", "conn"],
    [{type: "integer", name: "td"}, {type: "string", name: "_path"}]
  )
  const b = new Log(
    ["1", "conn"],
    [{type: "integer", name: "td"}, {type: "string", name: "fun"}]
  )

  expect(Log.isSame(a, b)).toBe(false)
})
