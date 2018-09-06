import React from "react"
import * as d3 from "d3"
import every from "lodash/every"

/*
  This file would love a clean up pass
*/

export default class CountByTime extends React.Component {
  constructor(props) {
    super(props)

    this.margin = {
      left: 48,
      top: 12,
      bottom: 24,
      right: 6
    }
  }

  innerWidth() {
    let innerWidth = this.props.width - this.margin.left - this.margin.right
    return innerWidth >= 0 ? innerWidth : 0
  }

  innerHeight() {
    return this.props.height - this.margin.top - this.margin.bottom
  }

  componentDidMount() {
    this.initChart()
    this.draw()
  }

  componentDidUpdate() {
    this.draw()
  }

  initChart() {
    d3.select(this.svg)
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)

    d3.select(this.svg)
      .append("g")
      .attr("class", "x-axis")
      .attr(
        "transform",
        `translate(${this.margin.left}, ${this.props.height -
          this.margin.bottom})`
      )

    d3.select(this.svg)
      .append("g")
      .attr("class", "chart")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)

    d3.select(this.svg)
      .append("g")
      .attr("class", "brush")
      .attr("transform", `translate(${this.margin.left}, 0)`)
  }

  draw() {
    if (!every(this.props.timeWindow)) return
    const {data, keys} = this.props

    const series = d3.stack().keys(keys)(data)

    const t = d3.transition().duration(300)

    // Y Axis
    const y = d3.scaleLinear().range([this.innerHeight(), 0])
    y.domain([0, d3.max(data, d => d.count)])
    d3.select(".y-axis").call(
      d3
        .axisLeft(y)
        .ticks(1)
        .tickValues(y.domain().map(d3.format("d")))
    )

    // X Axis
    const timeScale = d3.scaleUtc().range([0, this.innerWidth()])
    timeScale.domain(this.props.timeWindow)

    this.timeScale = timeScale

    const x = d3
      .scaleBand()
      .rangeRound([0, this.innerWidth()])
      .padding(0.05)
    x.domain(data.map(d => d.ts))
    d3.select(".x-axis")
      .transition(t)
      .call(d3.axisBottom(timeScale))

    // Brush
    const brush = d3
      .brushX()
      .extent([
        [0, 12],
        [this.innerWidth(), this.innerHeight() + this.margin.top]
      ])
    const onBrushEnd = () => {
      if (d3.event.selection) {
        this.props.setInnerTimeWindow(d3.event.selection.map(timeScale.invert))
        this.props.fetchMainSearch()
      } else {
        this.props.setInnerTimeWindow(null)
        this.props.fetchMainSearch()
      }
    }
    brush.on("end", onBrushEnd)
    d3.select(".brush").call(brush)

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
      .attr("y", this.innerHeight())
      .attr("opacity", 0)
      .remove()

    bars
      .enter()
      .append("rect")
      .attr("y", this.innerHeight())
      .attr("height", 0)
      .merge(bars)
      .attr("width", x.bandwidth())
      .attr("x", d => x(d.data.ts))
      .transition(t)
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
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
