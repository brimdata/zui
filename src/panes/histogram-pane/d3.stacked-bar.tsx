import {memo, useLayoutEffect, useRef} from "react"
import * as d3 from "d3"
import {call} from "src/util/call"

export const D3StackedBar = memo(function D3StackedHistogram(props: {
  width: number
  height: number
  margin: {left: number; right: number; top: number; bottom: number}
  xScale: d3.ScaleBand<string>
  yScale: d3.ScaleLinear<number, number>
  colorScale: (key: string) => string
  data: d3.Series<Record<string, number>, string>[]
  className: string
  onBrushPointerEnter?: (e: PointerEvent) => void
  onBrushPointerMove?: (e: PointerEvent) => void
  onBrushPointerLeave?: (e: PointerEvent) => void
}) {
  // Dimensions
  const {width, height, margin} = props
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  // Scales
  const {xScale, yScale, colorScale} = props
  xScale.range([0, innerWidth])
  yScale.range([innerHeight, 0])

  // Create the static elements on mount
  const ref = useRef<SVGSVGElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const svg = d3.select(el)
    svg.append("g").attr("class", "histogram")
    svg.append("g").attr("class", "x-axis")
    svg.append("g").attr("class", "y-axis")
    svg.append("g").attr("class", "brush")

    return () => {
      if (el) el.innerHTML = ""
    }
  }, [])

  // Render the chart when things are updated
  useLayoutEffect(() => {
    const svg = d3.select(ref.current)
    /**
     * Render the x axis
     */
    svg
      .select(".x-axis")
      .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))

    /**
     * Render the y axis
     */
    svg
      .select(".y-axis")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)

    /**
     * Render the bars
     */
    svg
      .select(".histogram")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .selectAll("g")
      .data(props.data, (d: {key: string}) => d.key)
      .join("g")
      .style("stroke", (d) => d3.rgb(colorScale(d.key)).darker().toString())
      .style("fill", (d) => colorScale(d.key))
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (d) => xScale("null"))
      .attr("width", xScale.bandwidth())
      .attr("y", (d) => yScale(d[1]))
      .attr("height", (d) => yScale(d[0]) - yScale(d[1]))

    /**
     * Render the brush layer
     */
    const brush = d3.brushX().extent([
      [0, 0],
      [innerWidth, innerHeight],
    ])
    svg
      .select(".brush")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(brush)

    /**
     * Render the mouseover layer
     */
    svg
      .select(".brush")
      .on("pointerenter", (e: PointerEvent) => {
        call(props.onBrushPointerEnter, e)
      })
      .on("pointermove", (e: PointerEvent) => {
        call(props.onBrushPointerMove, e)
      })
      .on("pointerleave", (e: PointerEvent) => {
        call(props.onBrushPointerLeave, e)
      })
  })

  return (
    <svg
      height={props.height}
      width={props.width}
      ref={ref}
      className={props.className}
    ></svg>
  )
})
