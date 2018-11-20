import Layout from "./Layout"
import AutoColumns from "./AutoColumns"
import FixedColumns from "./FixedColumns"
import * as mockLogs from "../../test/mockLogs"

test("#viewHeight", () => {
  const layout = new Layout({height: 500})

  expect(layout.viewHeight()).toBe(500)
})

test("#viewWidth", () => {
  const layout = new Layout({width: 960})

  expect(layout.viewWidth()).toBe(960)
})

test("#listHeight", () => {
  const layout = new Layout({size: 200, rowHeight: 10})

  expect(layout.listHeight()).toBe(2000)
})

test("#listWidth with auto columns", () => {
  const auto = new AutoColumns()
  const layout = new Layout({columnManager: auto})

  expect(layout.listWidth()).toBe("auto")
})

test("#listWidth when fixed columns", () => {
  const cols = ["a", "b", "c"]
  const colWidths = {a: 100, b: 100, default: 50}
  const fixed = new FixedColumns(cols, colWidths)
  const layout = new Layout({columnManager: fixed})

  expect(layout.listWidth()).toBe(250)
})

test("#rowHeight", () => {
  const layout = new Layout({rowHeight: 100})

  expect(layout.rowHeight()).toBe(100)
})

test("#rowWidth is same as listWidth", () => {
  const cols = ["a", "b", "c"]
  const colWidths = {a: 100, b: 100, default: 50}
  const fixed = new FixedColumns(cols, colWidths)
  const layout = new Layout({columnManager: fixed})

  expect(layout.rowWidth()).toBe(250)
})

test("#cellHeight is the same as rowHeight", () => {
  const layout = new Layout({rowHeight: 100})

  expect(layout.cellHeight()).toBe(100)
})

test("#cellWidth when auto columns", () => {
  const auto = new AutoColumns()
  const layout = new Layout({columnManager: auto})

  expect(layout.cellWidth("a")).toBe("auto")
})

test("#cellWidth when fixed columns", () => {
  const cols = ["a", "b", "c"]
  const colWidths = {a: 100, b: 100, default: 50}
  const fixed = new FixedColumns(cols, colWidths)
  const layout = new Layout({columnManager: fixed})

  expect(layout.cellWidth("b")).toBe(100)
})

test("#showHeader when auto", () => {
  const auto = new AutoColumns()
  const layout = new Layout({columnManager: auto})

  expect(layout.showHeader()).toBe(false)
})

test("#showHeader when fixed", () => {
  const cols = ["a", "b", "c"]
  const colWidths = {a: 100, b: 100, default: 50}
  const fixed = new FixedColumns(cols, colWidths)
  const layout = new Layout({columnManager: fixed})

  expect(layout.showHeader()).toBe(true)
})

test("#columns when fixed", () => {
  const cols = ["ts", "blah", "id.orig_h"]
  const colWidths = {default: 50}
  const fixed = new FixedColumns(cols, colWidths)
  const layout = new Layout({columnManager: fixed})
  const log = mockLogs.conn()
  expect(layout.columns(log)).toEqual(["ts", "blah", "id.orig_h"])
})

test("#columns when auto", () => {
  const auto = new AutoColumns()
  const layout = new Layout({columnManager: auto})
  const log = mockLogs.conn()

  expect(layout.columns(log)).toEqual([
    "_td",
    "_path",
    "ts",
    "uid",
    "id.orig_h",
    "id.orig_p",
    "id.resp_h",
    "id.resp_p",
    "proto",
    "service",
    "duration",
    "orig_bytes",
    "resp_bytes",
    "conn_state",
    "local_orig",
    "local_resp",
    "missed_bytes",
    "history",
    "orig_pkts",
    "orig_ip_bytes",
    "resp_pkts",
    "resp_ip_bytes",
    "tunnel_parents"
  ])
})
