/* @flow */

import type {Interval} from "../types"
import type {Span} from "../BoomClient/types"

type Dimens = {
  height: number,
  width: number,
  innerHeight: number,
  innerWidth: number
}

type Margins = {
  top: number,
  left: number,
  right: number,
  bottom: number
}

type Redraw = (Chart) => void
type ChartElementFunc = (Chart, Redraw) => void

export type ChartElement = {|
  draw?: ChartElementFunc,
  mount?: ChartElementFunc
|}

type PropsBuilder<ChartData, ChartState> = {|
  data: ChartData,
  state: ChartState,
  margins: Margins,
  buildElements: () => ChartElement[],
  className?: string
|}

type ChartBuilder<ChartData, ChartState> = {|
  svg: ?Element,
  data: ChartData,
  state: ChartState,
  margins: Margins,
  dimens: Dimens,
  yScale: Function,
  xScale: Function
|}

type HistogramState = {|
  selection: ?Span,
  isFetching: boolean,
  isEmpty: boolean
|}

export type HistogramData = {|
  points: {ts: Date, [string]: number}[],
  keys: string[],
  interval: Interval,
  span: Span
|}

export type HistogramProps = PropsBuilder<HistogramData, HistogramState>
export type HistogramChart = ChartBuilder<HistogramData, HistogramState>
export type Chart = HistogramChart
