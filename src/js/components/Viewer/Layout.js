/* @flow */

import AutoLayout from "./AutoLayout"
import FixedLayout from "./FixedLayout"
import Columns from "../../models/Columns"

export type Width = number | "auto"

export interface Layout {
  width: number;
  height: number;
  size: number;
  rowH: number;
  columns: Columns;

  viewHeight(): number;
  viewWidth(): number;
  listHeight(): number;
  listWidth(): Width;
  rowHeight(): number;
  rowWidth(): Width;
  cellHeight(): number;
  cellWidth(string): Width;
}

export const create = (args: $ReadOnly<Layout>) => {
  const {columns} = args
  if (
    columns.getTds().length === 1 ||
    columns.getVisible().length < columns.getAll().length
  ) {
    return new FixedLayout(args)
  } else {
    return new AutoLayout(args)
  }
}
