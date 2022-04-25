import {ChartData} from "../../../state/Chart/types"
import {DateTuple} from "../../../lib/TimeWindow"
import {HistogramData} from "../../charts/types"
import histogramInterval from "../../../lib/histogramInterval"

export type HistogramDataPoint = {
  ts: Date
  paths: {
    [key: string]: number
  }
  count: number
}

export default function format(
  data: ChartData,
  span: DateTuple
): HistogramData {
  const interval = histogramInterval(span)

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
  const spanStart = new Date(Math.min(...times, span[0].getTime()))
  return {
    interval,
    span: [spanStart, span[1]],
    points: bins,
    keys: data.keys,
  }
}
