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
import {memo} from "react"

export const Chart = memo(function Chart(
  props: {
    width: number
    height: number
  } & DataProps
) {
  const {width, height, range, data, interval} = props
  const dispatch = useDispatch()
  const tooltip = useTooltip()
  const {keys, map, stack, widePoints} = formatData(data)
  const yScale = d3.scaleLinear().domain([0, d3.max(widePoints, (v) => v.sum)])
  const xScale = d3
    .scaleUtc()
    .domain([interval(range[0]), interval.offset(interval(range[1]))])
  const colorScale = d3
    .scaleOrdinal<string, string>()
    .domain(keys)
    .range(d3.schemeCategory10)

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

  function onPointerMove(e: PointerEvent) {
    const [x] = d3.pointer(e)
    const ts = interval.floor(xScale.invert(x))
    const data = map.get(ts.getTime()) ?? null
    tooltip.setData(data)
    tooltip.move(e)
  }

  return (
    <>
      <D3StackedHistogram
        className={styles.graphic}
        width={width}
        height={height}
        interval={interval}
        data={stack}
        xScale={xScale}
        yScale={yScale}
        colorScale={colorScale}
        margin={{top: 29, bottom: 24, right: 14, left: 14}}
        onBrushEnd={onBrushEnd}
        onBrushMove={onBrushMove}
        onBrushPointerMove={onPointerMove}
        onBrushPointerEnter={tooltip.show}
        onBrushPointerLeave={tooltip.hide}
      />
      {createPortal(
        <Tooltip
          style={tooltip.style}
          data={tooltip.data}
          colorScale={colorScale}
        />,
        document.getElementById("tooltip-root")
      )}
    </>
  )
})
