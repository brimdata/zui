/* @flow */

import AutoLayout from "./AutoLayout"
import FixedLayout from "./FixedLayout"

export type Width = number | "auto"
export type Layout = AutoLayout | FixedLayout

type Args = {
  sumColumnWidths: number,
  width: number,
  height: number,
  rowHeight: number,
  size: number,
  type: "fixed" | "auto"
}

export const create = ({
  width,
  type,
  sumColumnWidths,
  height,
  rowHeight,
  size
}: Args) => {
  if (type === "fixed") {
    return new FixedLayout({
      type,
      width,
      height,
      size,
      rowH: rowHeight,
      rowW: Math.max(sumColumnWidths, width)
    })
  } else {
    return new AutoLayout({
      type,
      width,
      height,
      size,
      rowH: rowHeight,
      rowW: "auto"
    })
  }
}
