import {DateSpan} from "../components/charts/types"
import histogramInterval from "../lib/histogramInterval"
export function addEveryCountProc(program: string, span: DateSpan) {
  const BOOM_INTERVALS = {
    millisecond: "ms",
    second: "s",
    minute: "m",
    hour: "h",
    day: "d",
    week: "w",
    year: "y"
  }
  const {number, unit} = histogramInterval(span)

  return (
    program + ` | count() by every(${number}${BOOM_INTERVALS[unit]}), _path`
  )
}
