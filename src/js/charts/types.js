/* @flow */

import type {Interval} from "../types"
import type {Span} from "../BoomClient/types"

export type Dimens = {
  height: number,
  width: number
}

export type Margins = {
  top: number,
  left: number,
  right: number,
  bottom: number
}

type Redraw = (Chart) => void
type ChartElementFunc = (Chart, Redraw) => void

export type ChartElement = {|
  draw?: ChartElementFunc,
  mount?: (Element) => void
|}

export type ChartSVG = {|
  el: ?Element,
  margins: Margins,
  dimens: Dimens
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
  ...ChartSVG,
  data: HistogramData,
  state: HistogramState,
  yScale: Function,
  xScale: Function,
  elements: ChartElement[]
|}

export type Chart = HistogramChart
