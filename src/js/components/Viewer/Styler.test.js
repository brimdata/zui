import * as Styler from "./Styler"
import FixedLayout from "./FixedLayout"
import ColumnWidths from "./ColumnWidths"

const columnWidths = new ColumnWidths(["a", "b", "c"], {
  a: 100,
  b: 200,
  default: 10
})

const layout = new FixedLayout({
  size: 20,
  rowHeight: 10,
  columnManager: columnWidths,
  height: 300,
  width: 400
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
