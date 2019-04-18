/* @flow */

import Log from "../models/Log"

export function histogramLogs() {
  let descriptor = [
    {name: "ts", type: "time"},
    {name: "_path", type: "string"},
    {name: "count", type: "count"}
  ]

  return [
    new Log(["9999", "dns", "1"], descriptor),
    new Log(["9998", "conn", "2"], descriptor)
  ]
}
