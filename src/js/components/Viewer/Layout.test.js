/* @flow */

import AutoLayout from "./AutoLayout"
import ColumnWidths from "./ColumnWidths"
import * as mockLogs from "../../test/mockLogs"
import Columns from "../../models/Columns"
import uniqWith from "lodash/uniqWith"
import isEqual from "lodash/isEqual"

describe("AutoLayout", () => {
  const conn = mockLogs.conn()
  const dns = mockLogs.dns()
  const tds = [conn.get("_td"), dns.get("_td")]
  const all = uniqWith([...conn.descriptor, ...dns.descriptor], isEqual)
  const visible = [
    {name: "query", type: "string"},
    {name: "duration", type: "interval"},
    {name: "_path", type: "string"}
  ]
  const columns = new Columns({tds, all, visible})
  const autoLayout = new AutoLayout({
    height: 500,
    width: 960,
    rowH: 10,
    size: 200,
    columnsRename: columns
  })

  test("#pickVisibleColumns keeps original ordering", () => {
    expect(autoLayout.pickVisibleColumns(conn.descriptor)).toEqual([
      {name: "_path", type: "string"},
      {name: "duration", type: "interval"}
    ])
  })

  test("#pickVisibleColumns only picks from the logs descriptor", () => {
    expect(autoLayout.pickVisibleColumns(dns.descriptor)).toEqual([
      {name: "_path", type: "string"},
      {name: "query", type: "string"}
    ])
  })

  test("#viewHeight ", () => {
    expect(autoLayout.viewHeight()).toBe(500)
  })

  test("#viewWidth", () => {
    expect(autoLayout.viewWidth()).toBe(960)
  })

  test("#listHeight", () => {
    expect(autoLayout.listHeight()).toBe(2000)
  })

  test("#listWidth", () => {
    expect(autoLayout.listWidth()).toBe("auto")
  })

  test("#rowHeight", () => {
    expect(autoLayout.rowHeight()).toBe(10)
  })

  test("#cellHeight ", () => {
    expect(autoLayout.cellHeight()).toBe(10)
  })

  test("#cellWidth", () => {
    expect(autoLayout.cellWidth("a")).toBe("auto")
  })

  test("#columns", () => {
    const log = mockLogs.conn()

    expect(autoLayout.columns(log)).toEqual([
      "ts",
      "_path",
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
})

import FixedLayout from "./FixedLayout"

describe("FixedLayout", () => {
  const conn = mockLogs.conn()
  const tds = [conn.get("_td")]
  const all = conn.descriptor
  const visible = [{name: "ts", type: "time"}]
  const columns = new Columns({tds, all, visible})
  const columnWidths = new ColumnWidths(["a", "b", "c"], {
    a: 100,
    b: 100,
    default: 50
  })

  const fixedLayout = new FixedLayout({
    height: 500,
    width: 100,
    rowH: 10,
    size: 200,
    columnWidths,
    columnsRename: columns
  })

  test("#viewHeight", () => {
    expect(fixedLayout.viewHeight()).toBe(490)
  })

  test("#listWidth when sum of column widths > width", () => {
    fixedLayout.width = 10
    expect(fixedLayout.listWidth()).toBe(250)
    expect(fixedLayout.rowWidth()).toBe(250)
  })

  test("#listWidth ", () => {
    fixedLayout.width = 500
    expect(fixedLayout.listWidth()).toBe(500)
    expect(fixedLayout.rowWidth()).toBe(500)
  })

  test("#rowWidth is same as listWidth", () => {
    fixedLayout.width = 100
    expect(fixedLayout.rowWidth()).toBe(250)
  })

  test("#cellWidth", () => {
    expect(fixedLayout.cellWidth("b")).toBe(100)
  })

  test("#columns", () => {
    expect(fixedLayout.columns()).toEqual(["a", "b", "c"])
  })

  test("#pickVisibleColumns", () => {
    expect(fixedLayout.pickVisibleColumns(conn.descriptor)).toEqual([
      {name: "ts", type: "time"}
    ])
  })
})
