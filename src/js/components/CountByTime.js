import React from "react"
import * as d3 from "d3"
import isEqual from "lodash/isEqual"

const margin = {
  left: 48,
  top: 12,
  bottom: 24,
  right: 6
}

export default class CountByTime extends React.Component {
  shouldComponentUpdate(nextProps) {
    const {rawData, isFetching, width, height} = this.props
    return (
      nextProps.rawData !== rawData ||
      nextProps.isFetching !== isFetching ||
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
      .attr("class", "y-axis")
      .attr("transform", `translate(${left}, ${top})`)

    d3.select(svg)
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(${left}, ${height - bottom})`)

    d3.select(svg)
      .append("g")
      .attr("class", "chart")
      .attr("transform", `translate(${left}, ${top})`)

    d3.select(svg)
      .append("g")
      .attr("class", "brush")
      .attr("transform", `translate(${left}, 0)`)

    this.draw()
  }

  componentDidUpdate() {
    this.draw()
  }

  setScales() {
    const {innerWidth, innerHeight, props} = this
    const {data, timeWindow} = props

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
    const {scales, transition} = this

    d3.select(".x-axis")
      .transition(transition)
      .call(d3.axisBottom(scales.time))

    d3.select(".y-axis")
      .transition(transition)
      .call(
        d3
          .axisLeft(scales.y)
          .ticks(1)
          .tickValues(scales.y.domain().map(d3.format("d")))
      )
  }

  drawBrush() {
    const {props, scales} = this
    const {top} = margin
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
    const brush = d3.brushX().extent([[0, 12], [innerWidth, innerHeight + top]])
    element.call(brush)

    innerTimeWindow
      ? brush.move(element, innerTimeWindow.map(scales.time))
      : brush.move(element, null)

    brush.on("end", onBrushEnd)
    brush.on("start", onBrushStart)
  }

  drawChart() {
    const {props, t, scales} = this
    const {data, keys} = props
    const {x, y} = scales

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
      .transition(t)
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
      .attr("x", d => x(d.data.ts))
      .transition(t)
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
  }

  draw() {
    const {height, width} = this.props
    const {left, right, top, bottom} = margin

    this.innerWidth = Math.max(width - left - right, 0)
    this.innerHeight = Math.max(height - top - bottom, 0)
    this.transition = d3.transition().duration(300)

    this.setScales()
    this.drawAxes()
    this.drawBrush()
    this.drawChart()
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
