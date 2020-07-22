/* @flow */

import brim from ".."

test("coverts to an array of records", () => {
  let buffer = brim.flatRecordsBuffer()
  buffer.add(0, records)
  expect(buffer.channels()[0].records()).toMatchSnapshot()
})

test("flattens the columns", () => {
  let buffer = brim.flatRecordsBuffer()
  buffer.add(0, nestedRecords)
  expect(buffer.columns()).toMatchSnapshot()
})

test("coverts to an array of nested records", () => {
  let buffer = brim.flatRecordsBuffer()
  buffer.add(0, nestedRecords)
  expect(buffer.channels()[0].records()).toMatchSnapshot()
})

test("triple nested", () => {
  let buffer = brim.flatRecordsBuffer()
  buffer.add(0, tripleNest)
  expect(buffer.channels()[0].records()).toEqual([
    [
      {
        name: "a.b.c",
        type: "addr",
        value: "192.168.0.1"
      }
    ]
  ])
})

let records = [
  {
    id: 0,
    type: [
      {name: "ts", type: "time"},
      {name: "_path", type: "string"},
      {name: "count", type: "count"}
    ],
    values: ["1428917670.000000000", "dns", "2"]
  },
  {id: 0, values: ["1428917670.000000000", "conn", "3"]},
  {id: 0, values: ["1428917670.000000000", "capture_loss", "1"]},
  {id: 0, values: ["1428917640.000000000", "conn", "1"]}
]

let nestedRecords = [
  {
    id: 10,
    type: [
      {name: "_path", type: "string"},
      {name: "ts", type: "time"},
      {name: "uid", type: "string"},
      {
        name: "id",
        type: [
          {name: "orig_h", type: "addr"},
          {name: "orig_p", type: "port"},
          {name: "resp_h", type: "addr"},
          {name: "resp_p", type: "port"}
        ]
      },
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
    ],
    values: [
      "conn",
      "1428917684.732640",
      "ClM1vE3c4iNZUgpZhh",
      ["fe80::eef4:bbff:fe4f:b245", "143", "ff02::16", "0"],
      "icmp",
      null,
      null,
      null,
      null,
      "OTH",
      "F",
      "F",
      "0",
      null,
      "1",
      "76",
      "0",
      "0",
      null
    ]
  }
]

const tripleNest = [
  {
    id: 0,
    type: [{name: "a", type: [{name: "b", type: [{name: "c", type: "addr"}]}]}],
    values: [[["192.168.0.1"]]]
  }
]
