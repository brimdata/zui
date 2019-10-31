/* @flow */

import {conn, dns, files, http} from "../test/mockLogs"
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

test("getNs on an inverval field", () => {
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

  const getTs = (t) => t.get("ts")

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

describe("#correlationId", () => {
  test("when it has commas in it", () => {
    const log = files()
    let i = log.getIndex("conn_uids")
    log.tuple[i] = "abc,def"

    expect(log.correlationId()).toEqual('"abc,def"')
  })
})

describe("#toString", () => {
  test("serialize a log to a string", () => {
    let a = conn()
    expect(a.toString()).toBe(
      "_td:int	_path:string	ts:time	uid:string	id.orig_h:addr	id.orig_p:port	id.resp_h:addr	id.resp_p:port	proto:enum	service:string	duration:interval	orig_bytes:count	resp_bytes:count	conn_state:string	local_orig:bool	local_resp:bool	missed_bytes:count	history:string	orig_pkts:count	orig_ip_bytes:count	resp_pkts:count	resp_ip_bytes:count	tunnel_parents:set[string]		0	conn	1425612054.369843	Cynwae4qh1GxM82hQ2	192.168.0.50	1900	239.255.255.250	1900	udp	-	2.000293	282	0	S0	-	-	0	D	3	366	0	0	(empty)"
    )
  })

  test("serialize to string and build from that string again", () => {
    let a = conn()
    let b = Log.fromString(a.toString())

    expect(Log.isSame(a, b)).toBe(true)
  })
})
