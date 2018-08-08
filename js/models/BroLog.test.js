import BroLog from "./BroLog"
import Moment from "moment"

const connEvent = [
  "1",
  "conn",
  "1258218257.676301",
  "C2jMTN25eqMdtRv8Kj",
  "192.168.1.50",
  "65432",
  "4.2.2.4",
  "53",
  "udp",
  "dns",
  "1.0073",
  "-",
  "-",
  "S0",
  "-",
  "-",
  "0",
  "D",
  "1",
  "46",
  "0",
  "0",
  "(empty)"
]
const connSchema = [
  {name: "_td", type: "int"},
  {name: "_path", type: "string"},
  {name: "ts", type: "time"},
  {name: "uid", type: "string"},
  {name: "id.orig_h", type: "addr"},
  {name: "id.orig_p", type: "port"},
  {name: "id.resp_h", type: "addr"},
  {name: "id.resp_p", type: "port"},
  {name: "proto", type: "enum"},
  {name: "service", type: "string"},
  {name: "duration", type: "interval"},
  {name: "orig_bytes", type: "count"},
  {name: "resp_bytes", type: "count"},
  {name: "conn_state", type: "string"},
  {name: "local_orig", type: "bool"},
  {name: "local_resp", type: "bool"},
  {name: "missed_bytes", type: "count"},
  {name: "history", type: "string"},
  {name: "orig_pkts", type: "count"},
  {name: "orig_ip_bytes", type: "count"},
  {name: "resp_pkts", type: "count"},
  {name: "resp_ip_bytes", type: "count"},
  {name: "tunnel_parents", type: "set[string]"}
]

const broLog = new BroLog({values: connEvent, schema: connSchema})

test("#get path", () => {
  expect(broLog.getField("_path").toString()).toBe("conn")
})

test("#getField ts returns moment object", () => {
  expect(broLog.getField("ts").cast()).toBeInstanceOf(Moment)
})

test("#getField ts parses unix timestamp and formats to UTC", () => {
  expect(broLog.getField("ts").toString()).toBe("Nov 14, 2009 17:04:17.676")
})

test("#getField returns null when value is '-'", () => {
  expect(broLog.getField("orig_bytes").toString()).toBe("-")
})

test("#getField duration returns a number", () => {
  expect(broLog.getField("duration").toString()).toBe("1.007s")
})

test("buildFrom with known schema", () => {
  const [broLog] = BroLog.buildFrom({
    events: [connEvent],
    schemas: {1: connSchema}
  })

  expect(broLog).toBeInstanceOf(BroLog)
  expect(broLog.schema).toEqual(connSchema)
})

test("buildFrom with no schema", () => {
  const result = BroLog.buildFrom({events: [connEvent], schemas: {}})

  expect(result).toEqual([])
})

test("lineId returns path, uid, and ts", () => {
  expect(broLog.lineId()).toEqual({
    path: "conn",
    uid: "C2jMTN25eqMdtRv8Kj",
    ts: new Date("2009-11-14T17:04:17.676Z")
  })
})
