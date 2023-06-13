import {useEffect, useRef} from "react"
import {Interval} from "./get-interval"
import * as d3 from "d3"

//. maybe the thresholds go into the get-interval function

type Datum = {time: Date; group: string; count: number}

export function StackedHistogram(props: {
  width: number
  height: number
  range: [Date, Date]
  interval: Interval
  data: Datum[]
  onBrushPointerEnter?: (e: PointerEvent) => void
  onBrushPointerMove?: (e: PointerEvent) => void
  onBrushPointerLeave?: (e: PointerEvent) => void
  onBrushEnd: (extent: [Date, Date]) => void
  onBrushMove: () => void
}) {
  const i = props.interval.fn
  const start = i(props.range[0])
  const end = i.offset(i(props.range[1]))
  /**
   * Format the data
   */
  const {data} = props
  const xExtent = [start, end]
  const keysSet = new Set(data.map((d) => d.group))
  const keys = Array.from(keysSet).sort()
  /**
   * 1. Group the data by the time field
   */
  const group = (data) => {
    const map = new Map()
    data.forEach((d) => {
      if (!(d.time instanceof Date)) return
      if (map.has(d.time.getTime())) {
        map.get(d.time.getTime()).push(d)
      } else {
        map.set(d.time.getTime(), [d])
      }
    })
    return map
  }
  const grouped = group(data)

  /**
   * 2. Reduce the arrays into a wide object for each row
   */
  const widen = (data, keys) => {
    const zeros = keys.reduce((obj, k) => ({...obj, [k]: 0}), {})
    return Array.from(data.values()).map((group) => {
      const initial = {...zeros, sum: 0}
      return group.reduce(
        (row, d) => ({
          ...row,
          sum: row.sum + d.count,
          time: d.time,
          [d.group]: d.count,
        }),
        initial
      )
    })
  }
  const widened = widen(grouped, keys)

  /**
   * 3. Create a series of rows per key
   */
  const stack = d3.stack().keys(keys)
  const stacked = stack(widened)

  /**
   * Set up the dimensions
   */
  const {width, height} = props
  const margin = {top: 10, bottom: 20, right: 20, left: 20}
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  /**
   * Set up the scales
   */

  // @ts-ignore
  const yExtent = [0, d3.max(widened, (d) => d.sum)] as [number, number]
  const xScale = d3.scaleUtc().domain(xExtent).range([0, innerWidth])
  const yScale = d3.scaleLinear().domain(yExtent).range([innerHeight, 0])
  const colorScale = d3.scaleOrdinal().domain(keys).range(d3.schemeCategory10)
  const barWidth = xScale(i.offset(start))

  // Create the static elements on mount
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const svg = d3.select(ref.current)
    svg.append("g").attr("class", "histogram")
    svg.append("g").attr("class", "x-axis")
    svg.append("g").attr("class", "y-axis")
    svg.append("rect").attr("class", "hoverline")
    svg.append("g").attr("class", "brush")

    return () => {
      svg.innerHTML = ""
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
      // @ts-ignore
      .data(stacked, (d) => d.key)
      .join("g")
      // @ts-ignore
      .style("fill", (d) => colorScale(d.key))
      // @ts-ignore
      .style("stroke", (d) => d3.rgb(colorScale(d.key)).darker())
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
      .on("end", (e) => {
        if (e.selection) {
          props.onBrushEnd(e.selection.map(xScale.invert))
          brush.clear(svg.select(".brush"))
        }
      })
      .on("brush", (e) => {
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
      .on("pointerenter", (e) => call(props.onBrushPointerEnter, e))
      .on("pointermove", (e) => {
        call(props.onBrushPointerMove, e)
        const [x] = d3.pointer(e)
        line
          .attr("x", margin.left + x)
          .attr("y", margin.top)
          .attr("width", 1)
          .attr("height", innerHeight)
          .attr("opacity", 1)
      })
      .on("pointerleave", (e) => {
        call(props.onBrushPointerLeave, e)
        line.attr("opacity", 0)
      })
  })

  return <svg height={props.height} width={props.width} ref={ref}></svg>
}

function call<Fn extends (...a: any[]) => any>(
  fn: Fn,
  ...args: Parameters<Fn>
) {
  if (fn) fn(...args)
}
