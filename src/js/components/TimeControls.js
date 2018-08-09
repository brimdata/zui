import React from "react"
import XCountByTime from "../connectors/XCountByTime"
import TimeWindowPicker from "./TimeWindowPicker"
import isEqual from "lodash/isEqual"
import {humanDuration} from "../timeWindowFormatter"
import History from "../models/History"
import Minus from "../icons/zoom-out-sm.svg"
import Plus from "../icons/zoom-in-sm.svg"
import BarChart from "../icons/bar-chart-sm.svg"

export default class TimeControls extends React.Component {
  constructor(props) {
    super(props)
    this.onTimeWindowChange = this.onTimeWindowChange.bind(this)
    this.onZoomInClick = this.onZoomInClick.bind(this)
    this.onZoomOutClick = this.onZoomOutClick.bind(this)
    this.onBrush = this.onBrush.bind(this)
    this.history = new History()

    this.history.save(this.props.timeWindow)
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps.timeWindow, this.props.timeWindow)
  }

  onTimeWindowChange(timeWindow) {
    if (isEqual(timeWindow, this.props.timeWindow)) return
    this.history.clear()
    this.history.save(this.props.timeWindow)
    this.props.setTimeWindow(timeWindow)
    this.props.fetch()
  }

  onZoomInClick() {
    const timeWindow = this.history.getNext()
    if (timeWindow) {
      this.props.setTimeWindow(timeWindow)
      this.props.fetch()
    }
  }

  onZoomOutClick() {
    const timeWindow = this.history.getPrev()
    if (timeWindow) {
      this.props.setTimeWindow(timeWindow)
      this.props.fetch()
    }
  }

  onBrush(newTimeWindow) {
    this.history.save(newTimeWindow)
    this.props.setTimeWindow(newTimeWindow)
    this.props.fetch()
  }

  render() {
    return (
      <section className="count-by-time-area time-controls">
        <div className="time-window-picker-wrapper">
          <TimeWindowPicker
            timeWindow={this.props.timeWindow}
            onChange={this.onTimeWindowChange}
          />
        </div>

        <XCountByTime onBrush={this.onBrush} />

        <div className="time-controls-footer">
          <div className="chart-proc-wapper">
            <div className="chart-proc">
              <BarChart />
              <p>{this.props.reducerProgram}</p>
            </div>
          </div>

          <p className="duration-label">
            {humanDuration(this.props.timeWindow)}
          </p>

          <div className="zoom-buttons-wrapper">
            <button onClick={this.onZoomOutClick}>
              <Minus />
            </button>
            <button onClick={this.onZoomInClick}>
              <Plus />
            </button>
          </div>
        </div>
      </section>
    )
  }
}
