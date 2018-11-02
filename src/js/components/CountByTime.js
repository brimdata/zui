/* @flow */

import React from "react"
import * as d3 from "d3"
import isEqual from "lodash/isEqual"
import xAxisDrag from "./xAxisDrag"
import * as TimeWindow from "../lib/TimeWindow"
import type {DateTuple} from "../lib/TimeWindow"

const margin = {
  left: 0,
  top: 12,
  bottom: 24,
  right: 0
}

type Props = {
  rawData: any,
  data: {}[],
  timeBinCount: number,
  width: number,
  height: number,
  timeWindow: DateTuple,
  innerTimeWindow: DateTuple,
  keys: string[],
  setOuterTimeWindow: Function,
  setInnerTimeWindow: Function,
  fetchMainSearch: Function
}

type State = {
  innerWidth: number,
  innerHeight: number
}

export default class CountByTime extends React.Component<Props, State> {
  onDrag: Function
  onDragEnd: Function
  svg: any
  scales: {
    x: any,
    y: any,
    time: any
  }

  constructor(props: Props) {
    super(props)
    this.state = CountByTime.getDerivedStateFromProps(props)
    this.onDrag = this.onDrag.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  static getDerivedStateFromProps(props: Props) {
    return {
      innerWidth: Math.max(props.width - margin.left - margin.right, 0),
      innerHeight: Math.max(props.height - margin.top - margin.bottom, 0)
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    const {rawData, width, height} = this.props
    return (
      nextProps.rawData !== rawData ||
      nextProps.width !== width ||
      nextProps.height !== height
    )
  }

  componentDidMount() {
    const {svg} = this
    const {height} = this.props
    const {left, top, bottom} = margin

    d3.select(svg)
      .append("g")
      .attr("class", "chart")
      .attr("transform", `translate(${left}, ${top})`)

    d3.select(svg)
      .append("g")
      .attr("class", "brush")
      .attr("transform", `translate(${left}, 0)`)

    const xAxis = d3
      .select(svg)
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(${left}, ${height - bottom})`)

    const xAxisHandlers = xAxisDrag({
      parent: xAxis.node(),
      onDrag: this.onDrag,
      onDragEnd: this.onDragEnd
    })

    d3.select("body")
      .on("mousemove", xAxisHandlers.mouseMove)
      .on("mouseup", xAxisHandlers.mouseUp)

    xAxis
      .append("rect")
      .attr("class", "x-axis-drag")
      .attr("fill", "transparent")
      .attr("height", bottom)
      .on("mousedown", xAxisHandlers.mouseDown)

    d3.select(svg)
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${left}, ${top})`)

    d3.select(svg)
      .append("line")
      .attr("class", "time-cursor")

    this.draw()
  }

  componentDidUpdate() {
    this.draw()
  }

  onDrag(pos: number, startPos: number) {
    const [from, to] = [pos, startPos].map(num => this.scales.time.invert(num))
    const diff = TimeWindow.duration([from, to])
    const [nextFrom, nextTo] = TimeWindow.shift(this.props.timeWindow, diff)
    this.draw([nextFrom, nextTo])
  }

  onDragEnd(pos: number, startPos: number) {
    const [from, to] = [pos, startPos].map(this.scales.time.invert)
    const diff = TimeWindow.duration([from, to])
    this.props.setOuterTimeWindow(TimeWindow.shift(this.props.timeWindow, diff))
    this.props.fetchMainSearch()
  }

  setScales(timeWindow: DateTuple) {
    const {innerWidth, innerHeight} = this.state
    const {data, timeBinCount} = this.props
    const max = d3.max(data, d => d.count) || 0
    const xDomain = [] // Filled with fake values
    for (let i = 0; i < timeBinCount; ++i) xDomain.push(i)

    this.scales = {
      x: d3
        .scaleBand()
        .rangeRound([0, innerWidth])
        .domain(xDomain)
        .padding(0.05),
      y: d3
        .scaleLinear()
        .range([innerHeight, 0])
        .domain([0, max]),
      time: d3
        .scaleUtc()
        .range([0, innerWidth])
        .domain(timeWindow)
    }
  }

  drawAxes() {
    const {scales} = this
    const {innerWidth} = this.state
    d3.select(".x-axis").call(d3.axisBottom(scales.time))
    d3.select(".x-axis-drag").attr("width", this.state.innerWidth)
    d3.select(".y-axis")
      .call(
        d3
          .axisRight(scales.y)
          .ticks(1)
          .tickValues(scales.y.domain().map(d3.format("d")))
      )
      .selectAll(".tick")
      .each(function() {
        // This is all just to put a little background on the y axis number.
        // There very well might be a better way to do this when you re-write
        // this component.
        let {width, height, x, y} = this.querySelector("text").getBBox()
        const arrow = 5
        width += x + 5
        height += 4
        y -= 2

        d3.select(this)
          .selectAll("polygon")
          .remove()

        d3.select(this)
          .selectAll("line")
          .attr("x2", innerWidth)

        d3.select(this)
          .insert("polygon", "text")
          .attr("class", "tick-bg")
          .attr("transform", `translate(0, ${y})`)
          .attr(
            "points",
            [
              [0, 0],
              [width, 0],
              [width + arrow, height / 2],
              [width, height],
              [0, height]
            ]
              .map(a => a.join(","))
              .join(" ")
          )
      })
  }

  drawBrush() {
    const {props, scales} = this
    const {
      setInnerTimeWindow,
      setOuterTimeWindow,
      fetchMainSearch,
      innerTimeWindow
    } = props

    let prevSelection = null
    let justClicked = false
    let timeout

    function onBrushStart() {
      prevSelection = d3.brushSelection(d3.select(".brush").node())
    }

    function onBrushEnd() {
      const {selection, sourceEvent} = d3.event
      if (!sourceEvent) {
        return
      }
      if (!selection) {
        setInnerTimeWindow(null)
        fetchMainSearch()
        return
      }
      if (!isEqual(selection, prevSelection)) {
        setInnerTimeWindow(selection.map(scales.time.invert))
        fetchMainSearch()
        return
      }
      const [x] = d3.mouse(this)
      const [start, end] = selection
      const withinSelection = x >= start && x <= end
      const singleClickedSelection = withinSelection && !justClicked
      const doubleClickedSelection = withinSelection && justClicked
      if (singleClickedSelection) {
        justClicked = true
        timeout = setTimeout(() => (justClicked = false), 400)
        return
      }
      if (doubleClickedSelection) {
        setOuterTimeWindow(selection.map(scales.time.invert))
        setInnerTimeWindow(null)
        fetchMainSearch()
        justClicked = false
        clearTimeout(timeout)
        return
      }
    }

    const element = d3.select(".brush")
    const brush = d3
      .brushX()
      .extent([
        [0, 0],
        [this.state.innerWidth, this.state.innerHeight + margin.top]
      ])
    element.call(brush)

    innerTimeWindow
      ? brush.move(element, innerTimeWindow.map(scales.time))
      : brush.move(element, null)

    brush.on("end", onBrushEnd)
    brush.on("start", onBrushStart)
  }

  drawChart() {
    const {props, scales} = this
    const {data, keys} = props
    const {x, y, time} = scales
    const series = d3.stack().keys(keys)(data)
    const barGroups = d3
      .select(this.svg)
      .select(".chart")
      .selectAll("g")
      .data(series, d => d.key)
    const t = d3.transition().duration(100)

    barGroups
      .exit()
      .selectAll("rect")
      .remove()

    const bars = barGroups
      .enter()
      .append("g")
      .attr("class", d => `${d.key}-bg-color`)
      .merge(barGroups)
      .selectAll("rect")
      .data(d => d)

    bars
      .exit()
      .attr("opacity", 1)
      .attr("y", this.state.innerHeight)
      .attr("opacity", 0)
      .remove()

    bars
      .enter()
      .append("rect")
      .attr("y", this.state.innerHeight)
      .attr("height", 0)
      .merge(bars)
      .attr("width", x.bandwidth())
      .attr("x", d => time(d.data.ts))
      .transition(t)
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
  }

  draw(timeWindow: DateTuple = this.props.timeWindow) {
    this.setScales(timeWindow)
    this.drawAxes()
    this.drawBrush()
    this.drawChart()
  }

  render() {
    const {height, width} = this.props
    return (
      <div className="count-by-time-wrapper">
        <svg
          className="count-by-time"
          height={height}
          width={width}
          ref={r => (this.svg = r)}
        />
      </div>
    )
  }
}
