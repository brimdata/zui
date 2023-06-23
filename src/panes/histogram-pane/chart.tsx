import {useDispatch} from "src/app/core/state"
import {D3StackedHistogram} from "./d3-stacked-histogram"
import {useTooltip} from "./use-tooltip"
import {formatData} from "./format-data"
import {DataProps} from "./use-data-props"
import * as d3 from "d3"
import {createPortal} from "react-dom"
import submitSearch from "src/app/query-home/flows/submit-search"
import Editor from "src/js/state/Editor"
import {Tooltip} from "./tooltip"
import styles from "./histogram-pane.module.css"
import {memo, useMemo} from "react"

export const Chart = memo(function Chart(
  props: {
    width: number
    height: number
  } & DataProps
) {
  const {width, height, range, data, interval, colorMap} = props
  const dispatch = useDispatch()
  const tooltip = useTooltip()

  const histogramProps = useMemo(
    () => {
      const {keys, map, widePoints} = formatData(data)
      const maxY = d3.max(widePoints, (v) => v.sum)
      const margin = {top: 32, bottom: 24, right: 18, left: 18}
      const yScale = d3.scaleLinear().domain([0, maxY])
      const xScale = d3
        .scaleUtc()
        .domain([interval(range[0]), interval.offset(interval(range[1]))])

      const defaultColorScale = d3
        .scaleOrdinal<string, string>()
        .domain(keys)
        .range(d3.schemeTableau10)

      const colorScale = (key: string) => {
        const color = colorMap && colorMap[key]
        return color || defaultColorScale(key)
      }

      function onBrushMove(e: d3.D3BrushEvent<unknown>) {
        if (!e.selection) tooltip.show()
        else tooltip.hide()
      }

      function onBrushEnd([from, to]: [Date, Date]) {
        tooltip.show()
        const field = props.timeField
        dispatch(Editor.setTimeRange({field, from, to}))
        dispatch(submitSearch())
      }

      function onBrushPointerMove(e: PointerEvent) {
        const [x] = d3.pointer(e)
        const ts = interval.floor(xScale.invert(x))
        let data = map.get(ts.getTime()) ?? null
        tooltip.setData(data)
        tooltip.move(e)
      }

      function onBrushPointerEnter() {
        tooltip.show()
      }

      function onBrushPointerLeave() {
        tooltip.hide()
      }

      return {
        onBrushPointerMove,
        onBrushPointerEnter,
        onBrushPointerLeave,
        onBrushEnd,
        onBrushMove,
        colorScale,
        xScale,
        yScale,
        data: widePoints,
        keys,
        interval,
        margin,
      }
    },
    // Only re-render the histogram when the data prop changes.
    [props.data]
  )

  return (
    <>
      <D3StackedHistogram
        className={styles.graphic}
        width={width}
        height={height}
        {...histogramProps}
      />
      {createPortal(
        <Tooltip
          style={tooltip.style}
          data={tooltip.data}
          colorScale={histogramProps.colorScale}
        />,
        document.getElementById("tooltip-root")
      )}
    </>
  )
})
