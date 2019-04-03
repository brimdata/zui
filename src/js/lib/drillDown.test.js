/* @flow */
import Log from "../models/Log"
import drillDown from "./drillDown"

const tuple = ["192.168.0.54", "udp", "WPAD", "24"]
const descriptor = [
  {name: "id.orig_h", type: "addr"},
  {name: "proto", type: "enum"},
  {name: "query", type: "string"},
  {name: "count", type: "count"}
]

const result = new Log(tuple, descriptor)

test("combines keys in the group by proc", () => {
  const program = "_path=dns | count() by id.orig_h, proto, query | sort -r"

  expect(drillDown(program, result)).toBe(
    "_path=dns id.orig_h=192.168.0.54 proto=udp query=WPAD"
  )
})

test("removes *", () => {
  const program = "* | count() by id.orig_h"

  expect(drillDown(program, result)).toBe("id.orig_h=192.168.0.54")
})

test("removes *", () => {
  const program = "* | count() by id.orig_h"

  expect(drillDown(program, result)).toBe("id.orig_h=192.168.0.54")
})

test("easy peasy", () => {
  const program = "names james | count() by proto"

  expect(drillDown(program, result)).toBe("names james proto=udp")
})

test("count by and filter the same", () => {
  const program = "md5=123 | count() by md5 | sort -r | head 5"

  const result = new Log(
    ["123", "1"],
    [{type: "string", name: "md5"}, {type: "count", name: "count"}]
  )
  expect(drillDown(program, result)).toEqual("md5=123")
})

describe("null cases", () => {
  const nullPrograms = [
    "_path=conn",
    "_path=conn | sort duration",
    "_path=conn | avg()",
    "blah blah string",
    "un->pars=able"
  ]

  nullPrograms.forEach(program => {
    test(`${program} returns null`, () => {
      expect(drillDown(program, new Log([], []))).toBe(null)
    })
  })
})
