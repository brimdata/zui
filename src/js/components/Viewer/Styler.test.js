/* @flow */

import FixedLayout from "./FixedLayout"
import * as Styler from "./Styler"
import TableColumns from "../../models/TableColumns"

const layout = new FixedLayout({
  size: 20,
  rowH: 10,
  height: 300,
  width: 400,
  columns: new TableColumns("temp", [
    {td: "1", name: "_path", type: "string", width: 22, isVisible: true},
    {td: "2", name: "ts", type: "time", width: 33, isVisible: true},
    {td: "1", name: "duration", type: "interval", width: 44, isVisible: false},
    {td: "1", name: "duration", type: "interval", width: 44, isVisible: false}
  ])
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
  expect(Styler.row(layout)).toEqual({
    height: 10,
    width: 400
  })
})
