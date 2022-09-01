import {ChartData} from "src/js/state/Chart/types"
import {DateTuple} from "src/js/lib/TimeWindow"
import {HistogramData} from "../types"
import histogramInterval from "src/js/lib/histogramInterval"

export type HistogramDataPoint = {
  ts: Date
  paths: {
    [key: string]: number
  }
  count: number
}

export default function format(
  data: ChartData,
  range: DateTuple
): HistogramData {
  const interval = histogramInterval(range)

  const defaults: {
    [key: string]: number
  } = data.keys.reduce((obj, path) => ({...obj, [path]: 0}), {})

  const bins = []
  const times = Object.keys(data.table).map((ms) => {
    const epochTs = parseInt(ms)
    const ts = new Date(epochTs)
    bins.push({
      ts,
      paths: {
        ...defaults,
        ...data.table[ms],
      },
      count: Object.values(data.table[ms]).reduce((c, sum) => sum + c, 0),
    })
    return epochTs
  })
  const spanStart = new Date(Math.min(...times, range[0].getTime()))
  return {
    interval,
    span: [spanStart, range[1]],
    points: bins,
    keys: data.keys,
  }
}
