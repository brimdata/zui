/* @flow */
import type {Layout} from "./Layout"

export type RowRenderer = (
  index: number,
  isScrolling: boolean,
  layout: Layout
) => *

export type OnRowsRendered = (stopIndex: number) => *
