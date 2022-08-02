import {Interval} from "src/js/types"
export type DateSpan = [Date, Date]

export type Margins = {
  top: number
  left: number
  right: number
  bottom: number
}

type Redraw = (arg0: any) => void
type PenFunc = (arg0: any, arg1: Redraw) => void

export type Pen = {
  draw: PenFunc
  mount: (arg0: Element) => void
}

type HistogramState = {
  selection?: DateSpan | null | undefined
  isFetching?: boolean
  isEmpty?: boolean
  isDragging: boolean
}

export type HistogramData = {
  points: {
    ts: Date
    paths: {
      [key: string]: number
    }
    count: number
  }[]
  keys: string[]
  interval: Interval
  span: DateSpan
}

export type HistogramChart = {
  height: number
  width: number
  margins: Margins
  data: HistogramData
  state: HistogramState
  yScale: d3.ScaleLinear<any, any>
  xScale: d3.ScaleTime<any, any>
  pens: Pen[]
}

export type Chart = HistogramChart
