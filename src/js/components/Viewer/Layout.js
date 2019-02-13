/* @flow */

import type {ViewerDimens} from "../../types"
export type Width = number | "auto"
export type Layout = ViewerDimens

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
}: Args): ViewerDimens => {
  if (type === "fixed") {
    return {
      viewWidth: width,
      viewHeight: height - rowHeight,
      listWidth: Math.max(sumColumnWidths, width),
      listHeight: rowHeight * size,
      rowWidth: Math.max(sumColumnWidths, width),
      rowHeight
    }
  } else {
    return {
      viewWidth: width,
      viewHeight: height,
      listWidth: "auto",
      listHeight: rowHeight * size,
      rowWidth: "auto",
      rowHeight
    }
  }
}
