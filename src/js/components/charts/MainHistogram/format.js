/* @flow */

import type {ChartData} from "../../../state/Chart/types"
import type {HistogramData} from "../../charts/types"
import type {Span} from "../../../services/BoomClient/types"
import histogramInterval from "../../../lib/histogramInterval"

export default function(data: ChartData, span: Span): HistogramData {
  let interval = histogramInterval(span)

  let defaults = data.keys.reduce((obj, path) => ({...obj, [path]: 0}), {})

  let bins = Object.keys(data.table).map((ts) => {
    return {
      ts: new Date(parseInt(ts)),
      ...defaults,
      ...data.table[ts],
      count: Object.values(data.table[ts]).reduce(
        (c, sum) => parseInt(sum) + c,
        0
      )
    }
  })

  return {
    interval,
    span,
    points: bins,
    keys: data.keys
  }
}
