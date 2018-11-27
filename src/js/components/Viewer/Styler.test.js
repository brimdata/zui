/* @flow */

import * as Styler from "./Styler"
import FixedLayout from "./FixedLayout"
import ColumnWidths from "./ColumnWidths"
import * as mockLogs from "../../test/mockLogs"
import uniqWith from "lodash/uniqWith"
import isEqual from "lodash/isEqual"
import Columns from "../../models/Columns"

const columnWidths = new ColumnWidths(["a", "b", "c"], {
  a: 100,
  b: 200,
  default: 10
})

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

const layout = new FixedLayout({
  size: 20,
  rowH: 10,
  height: 300,
  width: 400,
  columnWidths,
  columns: columns
})

test("#viewer", () => {
  expect(Styler.viewer(layout)).toEqual({width: 400})
})

test("#view when fixed subtracts for header", () => {
  expect(Styler.view(layout)).toEqual({width: 400, height: 290})
})

test("#header", () => {
  expect(Styler.header(layout, 20)).toEqual({
    transform: "translateX(-20px)",
    width: 400
  })
})

test("#list", () => {
  expect(Styler.list(layout)).toEqual({height: 200, width: 400})
})

test("#row", () => {
  expect(Styler.row(layout, 4)).toEqual({
    height: 10,
    transform: "translateY(40px)",
    width: 400
  })
})

test("#cell", () => {
  expect(Styler.cell(layout, "c")).toEqual({width: 10})
})
