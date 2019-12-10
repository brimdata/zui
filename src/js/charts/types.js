/* @flow */

import type {Interval} from "../types"
import type {Span} from "../services/BoomClient/types"

export type Margins = {
  top: number,
  left: number,
  right: number,
  bottom: number
}

type Redraw = (*) => void
type PenFunc = (*, Redraw) => void

export type Pen = {|
  draw: PenFunc,
  mount: (Element) => void
|}

type HistogramState = {
  selection?: ?Span,
  isFetching?: boolean,
  isEmpty?: boolean
}

export type HistogramData = {|
  points: {ts: Date, [string]: number}[],
  keys: string[],
  interval: Interval,
  span: Span
|}

export type HistogramChart = {|
  height: number,
  width: number,
  margins: Margins,
  data: HistogramData,
  state: HistogramState,
  yScale: Function,
  xScale: Function,
  pens: Pen[]
|}

export type Chart = HistogramChart
