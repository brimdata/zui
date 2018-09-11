import React from "react"
import * as d3 from "d3"
import isEqual from "lodash/isEqual"
import xAxisDrag from "./xAxisDrag"
import moment from "moment"

const margin = {
  left: 0,
  top: 12,
  bottom: 24,
  right: 0
}

export default class CountByTime extends React.Component {
  constructor(props) {
    super(props)
    this.state = CountByTime.getDerivedStateFromProps(props)
  }

  static getDerivedStateFromProps(props) {
    return {
      innerWidth: Math.max(props.width - margin.left - margin.right, 0),
      innerHeight: Math.max(props.height - margin.top - margin.bottom, 0)
    }
  }

  shouldComponentUpdate(nextProps) {
    const {rawData, isFetching, width, height} = this.props
    return (
      nextProps.rawData !== rawData ||
      nextProps.isFetching !== isFetching ||
      nextProps.width !== width ||
      nextProps.height !== height ||
      nextProps.timeCursor !== this.props.timeCursor
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
      onDrag: (pos, startPos) => {
        const start = moment(this.scales.time.invert(startPos))
        const current = moment(this.scales.time.invert(pos))
        const ms = start.diff(current)
        const outerTimeWindow = this.props.timeWindow.map(d =>
          moment(d)
            .add(ms, "ms")
            .toDate()
        )
        this.draw(outerTimeWindow)
      },
      onDragEnd: (pos, startPos) => {
        const start = moment(this.scales.time.invert(startPos))
        const current = moment(this.scales.time.invert(pos))
        const ms = start.diff(current)
        const outerTimeWindow = this.props.timeWindow.map(d =>
          moment(d)
            .add(ms, "ms")
            .toDate()
        )
        this.props.setOuterTimeWindow(outerTimeWindow)
        this.props.fetchMainSearch()
      }
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

  setScales(timeWindow) {
    const {innerWidth, innerHeight} = this.state
    const {data} = this.props

    this.scales = {
      x: d3
        .scaleBand()
        .rangeRound([0, innerWidth])
        .domain(data.map(d => d.ts))
        .padding(0.05),
      y: d3
        .scaleLinear()
        .range([innerHeight, 0])
        .domain([0, d3.max(data, d => d.count)]),
      time: d3
        .scaleUtc()
        .range([0, innerWidth])
        .domain(timeWindow)
    }
  }

  drawAxes() {
    const {scales} = this
    d3.select(".x-axis").call(d3.axisBottom(scales.time))
    d3.select(".x-axis-drag").attr("width", this.state.innerWidth)
    d3.select(".y-axis").call(
      d3
        .axisRight(scales.y)
        .ticks(1)
        .tickValues(scales.y.domain().map(d3.format("d")))
    )
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
      .attr("y", innerHeight)
      .attr("opacity", 0)
      .remove()

    bars
      .enter()
      .append("rect")
      .attr("y", innerHeight)
      .attr("height", 0)
      .merge(bars)
      .attr("width", x.bandwidth())
      .attr("x", d => time(d.data.ts))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
  }

  drawTimeCursor() {
    const {height, timeCursor} = this.props
    if (timeCursor) {
      const x = this.scales.time(timeCursor)
      d3.select(".time-cursor")
        .style("display", "block")
        .attr("y2", height)
        .attr("y1", 0)
        .transition(
          d3
            .transition()
            .duration(100)
            .ease(d3.easeLinear)
        )
        .attr("x1", x)
        .attr("x2", x)
    } else {
      d3.select(".time-cursor").style("display", "none")
    }
  }

  draw(timeWindow = this.props.timeWindow) {
    this.setScales(timeWindow)
    this.drawAxes()
    this.drawBrush()
    this.drawChart()
    this.drawTimeCursor()
  }

  render() {
    const {isFetching, height, width} = this.props
    return (
      <div className="count-by-time-wrapper">
        {isFetching && (
          <div className="loading-message">
            <p>Graph data loading...</p>
          </div>
        )}

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
