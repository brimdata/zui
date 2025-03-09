import {memo, useLayoutEffect, useRef} from "react"
import * as d3 from "d3"

export const D3StackedHistogram = memo(function D3StackedHistogram(props: {
  width: number
  height: number
  margin: {left: number; right: number; top: number; bottom: number}
  xScale: d3.ScaleTime<number, number>
  yScale: d3.ScaleLinear<number, number>
  colorScale: (key: string) => string
  data: any[]
  keys: string[]
  interval: d3.TimeInterval
  className: string
  onBrushPointerEnter?: (e: PointerEvent) => void
  onBrushPointerMove?: (e: PointerEvent) => void
  onBrushPointerLeave?: (e: PointerEvent) => void
  onBrushEnd: (extent: [Date, Date]) => void
  onBrushMove: (e: d3.D3BrushEvent<unknown>) => void
  "aria-label"?: string
}) {
  // Dimensions
  const {width, height, margin} = props
  const innerWidth = Math.max(1, width - margin.left - margin.right)
  const innerHeight = Math.max(1, height - margin.top - margin.bottom)

  // Scales
  const {xScale, yScale, colorScale, interval} = props
  xScale.range([0, innerWidth])
  yScale.range([innerHeight, 0])
  const barWidth = xScale(interval.offset(xScale.domain()[0]))
  const data = d3.stack().keys(props.keys).order(d3.stackOrderAscending)(
    props.data
  )

  // Create the static elements on mount
  const ref = useRef<SVGSVGElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const svg = d3.select(el)
    svg.append("g").attr("class", "histogram")
    svg.append("g").attr("class", "x-axis")
    svg.append("g").attr("class", "y-axis")
    svg.append("rect").attr("class", "hoverline")
    svg.append("g").attr("class", "brush")
    svg.append("text").attr("class", "x-label")
    svg.append("text").attr("class", "y-label")

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
      .call(d3.axisBottom(xScale).ticks(4))

    /**
     * Render the y axis
     */
    const format = d3.format(".3~s")
    const maxY = yScale.domain()[1]
    svg
      .select(".y-axis")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisRight(yScale).tickValues([]))

    d3.select(".y-label")
      .text(format(maxY))
      .attr("x", margin.left)
      .attr("y", margin.top - 4)
      .attr("font-size", 10)

    /**
     * Render the bars
     */
    svg
      .select(".histogram")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .selectAll("g")
      .data(data, (d: {key: string}) => d.key)
      .join("g")
      .style("stroke", (d) => d3.rgb(colorScale(d.key)).darker().toString())
      .style("fill", (d) => colorScale(d.key))
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (d) => xScale(d.data.time))
      .attr("width", barWidth)
      .attr("y", (d) => yScale(d[1]))
      .attr("height", (d) => yScale(d[0]) - yScale(d[1]))

    /**
     * Render the brush layer
     */
    const brush = d3
      .brushX()
      .extent([
        [0, 0],
        [innerWidth, innerHeight],
      ])
      .on("end", (e: d3.D3BrushEvent<unknown>) => {
        if (e.selection) {
          props.onBrushEnd([
            xScale.invert(e.selection[0] as number),
            xScale.invert(e.selection[1] as number),
          ])
          brush.move(svg.selectAll(".brush"), null)
        }
      })
      .on("brush", (e: d3.D3BrushEvent<unknown>) => {
        call(props.onBrushMove, e)
      })

    svg
      .select(".brush")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(brush)

    /**
     * Render the mouseover layer
     */
    const line = svg.select(".hoverline")
    svg
      .select(".brush")
      .on("pointerenter", (e: PointerEvent) =>
        call(props.onBrushPointerEnter, e)
      )
      .on("pointermove", (e: PointerEvent) => {
        call(props.onBrushPointerMove, e)
        const [x] = d3.pointer(e)
        line
          .attr("x", margin.left + x)
          .attr("y", margin.top)
          .attr("width", 1)
          .attr("height", innerHeight)
          .attr("opacity", 1)
      })
      .on("pointerleave", (e: PointerEvent) => {
        call(props.onBrushPointerLeave, e)
        line.attr("opacity", 0)
      })
  })

  return (
    <svg
      height={props.height}
      width={props.width}
      ref={ref}
      className={props.className}
      aria-label={props["aria-label"]}
    ></svg>
  )
})

function call<Fn extends (...a: any[]) => any>(
  fn: Fn,
  ...args: Parameters<Fn>
) {
  if (fn) fn(...args)
}
