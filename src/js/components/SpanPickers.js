import React from "react"
import * as Time from "../lib/Time"
import TimePicker from "./TimePicker"
import DayPicker from "./DayPicker"
import * as TimeWindow from "../lib/TimeWindow"
import {ThinPicker} from "./Buttons"

export default class SpanPickers extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.extractState(props)
    this.onFromDayChange = this.onFromDayChange.bind(this)
    this.onToDayChange = this.onToDayChange.bind(this)
    this.onFromTimeChange = this.onFromTimeChange.bind(this)
    this.onToTimeChange = this.onToTimeChange.bind(this)
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.setState(this.extractState(props))
  }

  extractState(props) {
    this.selectedDays = {
      from: props.timeWindow[0],
      to: props.timeWindow[1]
    }
    return {
      fromDate: props.timeWindow[0],
      toDate: props.timeWindow[1]
    }
  }

  onFromDayChange(day) {
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

  onFromTimeChange(time) {
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

  onToTimeChange(time) {
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

  onToDayChange(day) {
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
      <div ref={r => (this.el = r)} className="button-group span-pickers">
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
        <ThinPicker>
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
import {bindActionCreators} from "redux"
import * as actions from "../actions/timeWindow"
import {submitSearchBar} from "../actions/searchBar"
import {getTimeWindow} from "../reducers/timeWindow"
import {getTimeZone} from "../reducers/view"
import {getCurrentSpaceTimeWindow} from "../reducers/spaces"

const stateToProps = state => ({
  timeWindow: getTimeWindow(state),
  timeZone: getTimeZone(state),
  spaceSpan: getCurrentSpaceTimeWindow(state)
})

export const XSpanPickers = connect(
  stateToProps,
  dispatch => bindActionCreators({...actions, submitSearchBar}, dispatch)
)(SpanPickers)
