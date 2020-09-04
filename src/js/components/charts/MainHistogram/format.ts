

import { ChartData } from "../../../state/Chart/types";
import { DateTuple } from "../../../lib/TimeWindow";
import { HistogramData } from "../../charts/types";
import histogramInterval from "../../../lib/histogramInterval";

export type HistogramDataPoint = {
  ts: Date;
  paths: {
    [key: string]: number;
  };
  count: number;
};

export default function (data: ChartData, span: DateTuple): HistogramData {
  let interval = histogramInterval(span);

  let defaults: {
    [key: string]: number;
  } = data.keys.reduce((obj, path) => ({ ...obj, [path]: 0 }), {});

  let bins = [];
  Object.keys(data.table).map(ms => {
    // Some data might be out of range
    let ts = new Date(parseInt(ms));
    if (ts >= span[0] && ts < span[1]) {
      bins.push({
        ts,
        paths: {
          ...defaults,
          ...data.table[ms]
        },
        count: Object.values(data.table[ms]).reduce((c, sum) => parseInt(sum) + c, 0)
      });
    }
  });

  return {
    interval,
    span,
    points: bins,
    keys: data.keys
  };
}