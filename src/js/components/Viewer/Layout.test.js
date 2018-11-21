/* @flow */

import Layout from "./Layout"
import ColumnWidths from "./ColumnWidths"
import * as mockLogs from "../../test/mockLogs"

describe("AutoLayout", () => {
  const autoLayout = new Layout({
    height: 500,
    width: 960,
    rowHeight: 10,
    size: 200
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

  test("#showHeader when auto", () => {
    expect(autoLayout.showHeader()).toBe(false)
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
  const columnManager = new ColumnWidths(["a", "b", "c"], {
    a: 100,
    b: 100,
    default: 50
  })

  const fixedLayout = new FixedLayout({
    height: 500,
    width: 100,
    rowHeight: 10,
    columnManager
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

  test("#showHeader", () => {
    expect(fixedLayout.showHeader()).toBe(true)
  })

  test("#columns", () => {
    const log = mockLogs.conn()
    expect(fixedLayout.columns(log)).toEqual(["a", "b", "c"])
  })
})
