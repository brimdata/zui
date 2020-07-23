/* @flow */

import type {Interval} from "../../types"

export type DateSpan = [Date, Date]

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
  selection?: ?DateSpan,
  isFetching?: boolean,
  isEmpty?: boolean,
  isDragging: boolean
}

export type HistogramData = {|
  points: {ts: Date, paths: {[string]: number}, count: number}[],
  keys: string[],
  interval: Interval,
  span: DateSpan
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
