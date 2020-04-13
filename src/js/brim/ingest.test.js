/* @flow */
import ingest from "./ingest"
import path from "path"

test("one pcap", () => {
  let data = ingest.getParams([{type: "pcap", path: "/work/my.pcap"}])

  expect(data).toEqual({
    dataDir: path.join("/work", "my.pcap.brim"),
    endpoint: "pcap",
    paths: ["/work/my.pcap"]
  })
})

test("one zeek log", () => {
  let data = ingest.getParams([{type: "zeek", path: "/work/zeek.log"}])

  expect(data).toEqual({
    dataDir: path.join("/work", "zeek.log.brim"),
    endpoint: "zeek",
    paths: ["/work/zeek.log"]
  })
})

test("two zeek logs in same dir", () => {
  let data = ingest.getParams(
    [
      {type: "zeek", path: "/work/zeek-1.log"},
      {type: "zeek", path: "/work/zeek-2.log"}
    ],
    "/home"
  )

  expect(data).toEqual({
    dataDir: path.join("/home", ".brim", "work.brim"),
    endpoint: "zeek",
    paths: ["/work/zeek-1.log", "/work/zeek-2.log"]
  })
})

test("two zeek logs in different dir", () => {
  let data = ingest.getParams(
    [
      {type: "zeek", path: "/work/day-1/zeek.log"},
      {type: "zeek", path: "/work/day-2/zeek.log"}
    ],
    "/home",
    new Date(0)
  )

  expect(data).toEqual({
    dataDir: path.join("/home", ".brim", "zeek_1969-12-31_16:00:00.brim"),
    endpoint: "zeek",
    paths: ["/work/day-1/zeek.log", "/work/day-2/zeek.log"]
  })
})

test("two pcaps", () => {
  let data = ingest.getParams([
    {type: "pcap", path: "/pcap-1"},
    {type: "pcap", path: "/pcap-2"}
  ])

  expect(data).toEqual({
    error: "Only one pcap can be opened at a time."
  })
})

test("1 pcap and 1 zeek", () => {
  let data = ingest.getParams([
    {type: "pcap", path: "/pcap-1"},
    {type: "zeek", path: "/zeek-1"}
  ])

  expect(data).toEqual({
    error: "Only files of a single type (zeek or pcap) can be opened."
  })
})
