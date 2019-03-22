/* @flow */

import {conn, dns, http} from "../test/mockLogs"
import Log from "./Log"

test("isSame when tuples are the same", () => {
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

test("isSame when tuples are different", () => {
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

test("getSec on a time field", () => {
  const log = conn()
  // "1425612054.369843"
  expect(log.getSec("ts")).toEqual(1425612054)
})

test("getSec on a duration field", () => {
  const log = conn()
  // "2.000293"
  expect(log.getSec("duration")).toEqual(2)
})

test("getNs on a time field", () => {
  const log = conn()
  // "1425612054.369843"
  expect(log.getNs("ts")).toEqual(369843000)
})

test("getNs on a time field", () => {
  const log = conn()
  // "2.000293"
  expect(log.getNs("duration")).toEqual(293000)
})

test("getSec on non time field", () => {
  const log = conn()

  expect(() => log.getSec("_path")).toThrow("_path is not a time type")
})

test("getNs on non time field", () => {
  const log = conn()

  expect(() => log.getNs("_path")).toThrow("_path is not a time type")
})

describe(".sort", () => {
  let logs
  beforeEach(() => {
    logs = [conn(), dns(), http()]
  })

  const getTs = t => t.get("ts")

  test("asc", () => {
    Log.sort(logs, "ts", "asc")

    expect(logs.map(getTs)).toEqual([
      "1425565514.419939",
      "1425567042.047800",
      "1425612054.369843"
    ])
  })

  test("desc", () => {
    Log.sort(logs, "ts", "desc")

    expect(logs.map(getTs)).toEqual([
      "1425612054.369843",
      "1425567042.047800",
      "1425565514.419939"
    ])
  })
})
