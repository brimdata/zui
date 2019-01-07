/* @flow */

import AutoLayout from "./AutoLayout"
import FixedLayout from "./FixedLayout"

export type Width = number | "auto"
export type Layout = AutoLayout | FixedLayout

export const create = (args: $ReadOnly<AutoLayout>) => {
  const {columns} = args
  if (columns.showHeader()) {
    return new FixedLayout(args)
  } else {
    return new AutoLayout(args)
  }
}
