import {useEffect, useRef} from "react"
import * as d3 from "d3"

export function D3StackedHistogram(props: {
  width: number
  height: number
  margin: {left: number; right: number; top: number; bottom: number}
  xScale: d3.ScaleTime<number, number>
  yScale: d3.ScaleLinear<number, number>
  colorScale: d3.ScaleOrdinal<string, string>
  data: d3.Series<Record<string, number>, string>[]
  interval: d3.TimeInterval
  className: string
  onBrushPointerEnter?: (e: PointerEvent) => void
  onBrushPointerMove?: (e: PointerEvent) => void
  onBrushPointerLeave?: (e: PointerEvent) => void
  onBrushEnd: (extent: [Date, Date]) => void
  onBrushMove: (e: PointerEvent) => void
}) {
  // Dimensions
  const {width, height, margin} = props
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  // Scales
  const {xScale, yScale, colorScale, interval} = props
  xScale.range([0, innerWidth])
  yScale.range([innerHeight, 0])
  const barWidth = xScale(interval.offset(xScale.domain()[0]))

  // Create the static elements on mount
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const svg = d3.select(el)
    svg.append("g").attr("class", "histogram")
    svg.append("g").attr("class", "x-axis")
    svg.append("g").attr("class", "y-axis")
    svg.append("rect").attr("class", "hoverline")
    svg.append("g").attr("class", "brush")

    return () => {
      if (el) el.innerHTML = ""
    }
  }, [])

  // Render the chart when things are updated
  useEffect(() => {
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
    svg
      .select(".y-axis")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisRight(yScale).tickValues([yScale.domain()[1]]))

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
      .on("brush", (e: PointerEvent) => {
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
    ></svg>
  )
}

function call<Fn extends (...a: any[]) => any>(
  fn: Fn,
  ...args: Parameters<Fn>
) {
  if (fn) fn(...args)
}
