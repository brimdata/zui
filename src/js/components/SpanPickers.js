/* @flow */

import React from "react"
import * as Time from "../lib/Time"
import TimePicker from "./TimePicker"
import DayPicker from "./DayPicker"
import * as TimeWindow from "../lib/TimeWindow"
import {ThinPicker} from "./Buttons"
import type {DateTuple} from "../lib/TimeWindow"
import type {TimeObj} from "../lib/Time"

type Props = {
  timeWindow: DateTuple,
  spaceSpan: DateTuple,
  setOuterTimeWindow: Function
}

type State = {
  fromDate: Date,
  toDate: Date
}

export default class SpanPickers extends React.Component<Props, State> {
  onFromDayChange: Function
  onToDayChange: Function
  onFromTimeChange: Function
  onToTimeChange: Function

  constructor(props: Props) {
    super(props)
    this.state = {
      ...SpanPickers.getDerivedStateFromProps(props)
    }
    this.onFromDayChange = this.onFromDayChange.bind(this)
    this.onToDayChange = this.onToDayChange.bind(this)
    this.onFromTimeChange = this.onFromTimeChange.bind(this)
    this.onToTimeChange = this.onToTimeChange.bind(this)
  }

  static getDerivedStateFromProps(nextProps: Props) {
    return {
      fromDate: nextProps.timeWindow[0],
      toDate: nextProps.timeWindow[1]
    }
  }

  onFromDayChange(day: Date) {
    const fromDate = Time.set(this.state.fromDate, {
      month: day.getMonth(),
      date: day.getDate(),
      year: day.getFullYear()
    })

    if (fromDate > this.state.toDate) {
      const toDate = Time.add(fromDate, 30, "minutes")
      this.setState({fromDate, toDate})
      this.props.setOuterTimeWindow([fromDate, toDate])
    } else {
      this.setState({fromDate})
      this.props.setOuterTimeWindow([fromDate, this.state.toDate])
    }
  }

  onFromTimeChange(time: TimeObj) {
    const fromDate = Time.set(this.state.fromDate, time)

    if (fromDate > this.state.toDate) {
      const toDate = Time.add(fromDate, 30, "minutes")
      this.setState({fromDate, toDate})
      this.props.setOuterTimeWindow([fromDate, toDate])
    } else {
      this.setState({fromDate})
      this.props.setOuterTimeWindow([fromDate, this.state.toDate])
    }
  }

  onToTimeChange(time: TimeObj) {
    console.log(time)
    const toDate = Time.set(this.state.toDate, time)
    this.setState({toDate})
    this.props.setOuterTimeWindow([this.state.fromDate, toDate])

    if (toDate < this.state.fromDate) {
      const fromDate = Time.subtract(toDate, 30, "minutes")
      this.setState({fromDate, toDate})
      this.props.setOuterTimeWindow([fromDate, toDate])
    } else {
      this.setState({toDate})
      this.props.setOuterTimeWindow([this.state.fromDate, toDate])
    }
  }

  onToDayChange(day: Date) {
    const toDate = Time.set(this.state.toDate, {
      month: day.getMonth(),
      date: day.getDate(),
      year: day.getFullYear()
    })

    if (toDate < this.state.fromDate) {
      const fromDate = Time.subtract(toDate, 30, "minutes")
      this.setState({fromDate, toDate})
      this.props.setOuterTimeWindow([fromDate, toDate])
    } else {
      this.setState({toDate})
      this.props.setOuterTimeWindow([this.state.fromDate, toDate])
    }
  }

  render() {
    return (
      <div className="button-group span-pickers">
        <div className="thin-button">
          <DayPicker
            from={this.state.fromDate}
            to={this.state.toDate}
            day={this.state.fromDate}
            onDayChange={this.onFromDayChange}
          />
          <TimePicker
            time={this.state.fromDate}
            onTimeChange={this.onFromTimeChange}
          />
        </div>
        <div className="span-duration">
          <hr />
          <p>{TimeWindow.humanDuration(this.props.timeWindow)}</p>
          <hr />
        </div>
        <div className="thin-button">
          <DayPicker
            from={this.state.fromDate}
            to={this.state.toDate}
            day={this.state.toDate}
            onDayChange={this.onToDayChange}
          />
          <TimePicker
            time={this.state.toDate}
            onTimeChange={this.onToTimeChange}
          />
        </div>
        <ThinPicker align="right">
          <li
            onClick={() => this.props.setOuterTimeWindow(this.props.spaceSpan)}
          >
            Whole Space
          </li>
          <li
            onClick={() =>
              this.props.setOuterTimeWindow(TimeWindow.last(30, "minutes"))
            }
          >
            Last 30 minutes
          </li>
          <li
            onClick={() =>
              this.props.setOuterTimeWindow(TimeWindow.last(24, "hours"))
            }
          >
            Last 24 hours
          </li>
          <li
            onClick={() =>
              this.props.setOuterTimeWindow(TimeWindow.last(7, "days"))
            }
          >
            Last 7 days
          </li>
          <li
            onClick={() =>
              this.props.setOuterTimeWindow(TimeWindow.last(30, "days"))
            }
          >
            Last 30 days
          </li>
          <li
            onClick={() =>
              this.props.setOuterTimeWindow(TimeWindow.last(90, "days"))
            }
          >
            Last 90 days
          </li>
        </ThinPicker>
      </div>
    )
  }
}

import {connect} from "react-redux"
import * as actions from "../actions/timeWindow"
import {getTimeWindow} from "../reducers/timeWindow"
import {getTimeZone} from "../reducers/view"
import {getCurrentSpaceTimeWindow} from "../reducers/spaces"

const stateToProps = state => ({
  timeWindow: getTimeWindow(state),
  timeZone: getTimeZone(state),
  spaceSpan: getCurrentSpaceTimeWindow(state)
})

const dispatchToProps = (dispatch: Function) => ({
  setOuterTimeWindow: (span: DateTuple) => {
    return dispatch(actions.setOuterTimeWindow(span))
  }
})

export const XSpanPickers = connect(
  stateToProps,
  dispatchToProps
)(SpanPickers)
