import BroLog from "../models/BroLog"

const connEvent = [
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
  {name: "path", type: "string"},
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

export default new BroLog({values: connEvent, schema: connSchema})
