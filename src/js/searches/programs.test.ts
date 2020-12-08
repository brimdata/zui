import {zng} from "../../../zealot/dist"
import {connCorrelation} from "./programs"

test("conn correlation", () => {
  const conn: zng.SerializedRecord = {
    type: {
      type: "record",
      of: [
        {name: "_path", type: "string"},
        {name: "ts", type: "time"},
        {name: "uid", type: "string"},
        {
          name: "id",
          of: [
            {name: "orig_h", type: "addr"},
            {name: "orig_p", type: "port"},
            {name: "resp_h", type: "addr"},
            {name: "resp_p", type: "port"}
          ],
          type: "record"
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
        {name: "tunnel_parents", of: "string", type: "set"},
        {
          name: "geo",
          of: [
            {
              name: "orig",
              of: [
                {name: "country_code", type: "string"},
                {name: "region", type: "string"},
                {name: "city", type: "string"},
                {name: "latitude", type: "double"},
                {name: "longitude", type: "double"}
              ],
              type: "record"
            },
            {
              name: "resp",
              of: [
                {name: "country_code", type: "string"},
                {name: "region", type: "string"},
                {name: "city", type: "string"},
                {name: "latitude", type: "double"},
                {name: "longitude", type: "double"}
              ],
              type: "record"
            }
          ],
          type: "record"
        },
        {name: "community_id", type: "string"}
      ]
    },
    value: [
      "conn",
      "1425568032.998178",
      "CbOjYpkXn9LfqV51c",
      ["192.168.0.51", "41970", "130.239.18.173", "80"],
      "tcp",
      "http",
      "0.70995",
      "676",
      "1530",
      "S1",
      null,
      null,
      "0",
      "ShADad",
      "7",
      "976",
      "7",
      "1822",
      null,
      [
        [null, null, null, null, null],
        ["SE", "AC", "Umeå", "63.8284", "20.2597"]
      ],
      "1:h09VUfAoDYfBA0xGKuKCQ7nOxqU="
    ]
  }
  const record = zng.Record.deserialize(conn)

  expect(connCorrelation(record)).toBe(
    'uid="CbOjYpkXn9LfqV51c" or "CbOjYpkXn9LfqV51c" in conn_uids or "CbOjYpkXn9LfqV51c" in uids or referenced_file.uid="CbOjYpkXn9LfqV51c" or (community_id = "1:h09VUfAoDYfBA0xGKuKCQ7nOxqU=" and ts >= 1425568032.998 and ts < 1425568123.707) | head 100'
  )
})
