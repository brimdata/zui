import {DateTuple} from "src/js/lib/TimeWindow"
import ChartSVG from "../ChartSVG"
import useMainHistogram from "./useMainHistogram"

export type HistogramProps = {height: number; width: number; range: DateTuple}

export function MainHistogramSvg(props: HistogramProps) {
  const chart = useMainHistogram(props)
  return <ChartSVG chart={chart} />
}
