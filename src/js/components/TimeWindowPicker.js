import React from "react"
import * as Time from "../lib/Time"
import TimePicker from "./TimePicker"
import DayPicker from "./DayPicker"

export default class TimeWindowPicker extends React.Component {
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
      this.props.onChange([fromDate, toDate])
    } else {
      this.setState({fromDate})
      this.props.onChange([fromDate, this.state.toDate])
    }
  }

  onFromTimeChange(time) {
    const fromDate = Time.set(this.state.fromDate, time)

    if (fromDate > this.state.toDate) {
      const toDate = Time.add(fromDate, 30, "minutes")
      this.setState({fromDate, toDate})
      this.props.onChange([fromDate, toDate])
    } else {
      this.setState({fromDate})
      this.props.onChange([fromDate, this.state.toDate])
    }
  }

  onToTimeChange(time) {
    const toDate = Time.set(this.state.toDate, time)
    this.setState({toDate})
    this.props.onChange([this.state.fromDate, toDate])

    if (toDate < this.state.fromDate) {
      const fromDate = Time.subtract(toDate, 30, "minutes")
      this.setState({fromDate, toDate})
      this.props.onChange([fromDate, toDate])
    } else {
      this.setState({toDate})
      this.props.onChange([this.state.fromDate, toDate])
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
      this.props.onChange([fromDate, toDate])
    } else {
      this.setState({toDate})
      this.props.onChange([this.state.fromDate, toDate])
    }
  }

  render() {
    return (
      <div ref={r => (this.el = r)} className="time-window-picker">
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
        <span className="divider">–</span>
        <TimePicker
          time={this.state.toDate}
          onTimeChange={this.onToTimeChange}
        />
        <DayPicker
          from={this.state.fromDate}
          to={this.state.toDate}
          day={this.state.toDate}
          onDayChange={this.onToDayChange}
        />
      </div>
    )
  }
}
