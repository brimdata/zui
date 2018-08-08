import React from "react"
import moment from "moment"
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
    const fromDate = moment
      .utc(this.state.fromDate)
      .set({
        month: day.getMonth(),
        date: day.getDate(),
        year: day.getFullYear()
      })
      .toDate()

    if (fromDate > this.state.toDate) {
      const toDate = moment
        .utc(fromDate)
        .add(30, "minutes")
        .toDate()
      this.setState({fromDate, toDate})
      this.props.onChange([fromDate, toDate])
    } else {
      this.setState({fromDate})
      this.props.onChange([fromDate, this.state.toDate])
    }
  }

  onFromTimeChange(time) {
    const fromDate = moment
      .utc(this.state.fromDate)
      .set(time)
      .toDate()

    if (fromDate > this.state.toDate) {
      const toDate = moment
        .utc(fromDate)
        .add(30, "minutes")
        .toDate()
      this.setState({fromDate, toDate})
      this.props.onChange([fromDate, toDate])
    } else {
      this.setState({fromDate})
      this.props.onChange([fromDate, this.state.toDate])
    }
  }

  onToTimeChange(time) {
    const toDate = moment
      .utc(this.state.toDate)
      .set(time)
      .toDate()
    this.setState({toDate})
    this.props.onChange([this.state.fromDate, toDate])

    if (toDate < this.state.fromDate) {
      const fromDate = moment
        .utc(toDate)
        .subtract(30, "minutes")
        .toDate()
      this.setState({fromDate, toDate})
      this.props.onChange([fromDate, toDate])
    } else {
      this.setState({toDate})
      this.props.onChange([this.state.fromDate, toDate])
    }
  }

  onToDayChange(day) {
    const toDate = moment
      .utc(this.state.toDate)
      .set({
        month: day.getMonth(),
        date: day.getDate(),
        year: day.getFullYear()
      })
      .toDate()

    if (toDate < this.state.fromDate) {
      const fromDate = moment
        .utc(toDate)
        .subtract(30, "minutes")
        .toDate()
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
