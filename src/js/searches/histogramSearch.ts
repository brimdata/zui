

import { DateSpan } from "../components/charts/types";
import histogramInterval from "../lib/histogramInterval";

export function addEveryCountProc(program: string, span: DateSpan) {
  const BOOM_INTERVALS = {
    millisecond: "ms",
    second: "sec",
    minute: "min",
    hour: "hr",
    day: "day",
    month: "month"
  };
  const {
    number,
    unit
  } = histogramInterval(span);

  return program + ` | every ${number}${BOOM_INTERVALS[unit]} count() by _path`;
}