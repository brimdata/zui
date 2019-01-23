/* @flow */

import React from "react"
import * as Time from "../lib/Time"
import TimePicker from "./TimePicker"
import DayPicker from "./DayPicker"
import * as TimeWindow from "../lib/TimeWindow"
import {ThinPicker} from "./Buttons"
import type {DateTuple} from "../lib/TimeWindow"
import type {TimeObj} from "../lib/Time"
import DropMenu from "./DropMenu"
import {XSpanPickerMenu} from "./SpanPickerMenu"
import {connect} from "react-redux"
import * as actions from "../actions/timeWindow"
import {getTimeWindow} from "../reducers/timeWindow"
import {getTimeZone} from "../reducers/view"
import {getCurrentSpaceTimeWindow} from "../reducers/spaces"
import * as searchBar from "../actions/searchBar"

type Props = {
  timeWindow: DateTuple,
  spaceSpan: DateTuple,
  setOuterTimeWindow: Function,
  submitSearchBar: Function
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
  fromTime: TimePicker
  toTime: TimePicker
  toDate: DayPicker
  blurTimeout: TimeoutID

  constructor(props: Props) {
    super(props)
    this.state = SpanPickers.getDerivedStateFromProps(props)
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

    this.fromTime.focus()
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

    this.toDate.focus()
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

    this.toTime.focus()
  }

  onToTimeChange(time: TimeObj) {
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

    this.toTime.blur()
  }

  render() {
    return (
      <div
        className="button-group span-pickers"
        onFocus={() => clearTimeout(this.blurTimeout)}
        onBlur={() => {
          clearTimeout(this.blurTimeout)
          this.blurTimeout = setTimeout(this.props.submitSearchBar, 100)
        }}
      >
        <div className="thin-button">
          <DayPicker
            from={this.state.fromDate}
            to={this.state.toDate}
            day={this.state.fromDate}
            onDayChange={this.onFromDayChange}
          />
          <TimePicker
            ref={r => (this.fromTime = r)}
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
            ref={r => (this.toDate = r)}
          />
          <TimePicker
            time={this.state.toDate}
            onTimeChange={this.onToTimeChange}
            ref={r => (this.toTime = r)}
          />
        </div>

        <DropMenu
          menu={<XSpanPickerMenu />}
          className="span-drop-menu"
          position="right"
        >
          <ThinPicker />
        </DropMenu>
      </div>
    )
  }
}

const stateToProps = state => ({
  timeWindow: getTimeWindow(state),
  timeZone: getTimeZone(state),
  spaceSpan: getCurrentSpaceTimeWindow(state)
})

const dispatchToProps = (dispatch: Function) => ({
  setOuterTimeWindow: (span: DateTuple) => {
    return dispatch(actions.setOuterTimeWindow(span))
  },
  submitSearchBar: () => {
    dispatch(searchBar.submitSearchBar())
  }
})

export const XSpanPickers = connect(
  stateToProps,
  dispatchToProps
)(SpanPickers)
