/* @flow */
import DayPickerInput from "react-day-picker/DayPickerInput"
import React from "react"

import * as Time from "../lib/Time"

const FORMAT = "MMM D, YYYY"

type Props = {
  onDayChange: Function,
  from: Date,
  to: Date,
  day: Date
}

type State = {
  inputWidth: number
}

export default class DayPicker extends React.Component<Props, State> {
  daypicker: *

  constructor(props: Props) {
    super(props)
    this.state = {inputWidth: 70}
  }

  focus() {
    if (this.daypicker) {
      this.daypicker.input.focus()
    }
  }

  componentDidMount() {
    this.measureInput()
  }

  componentDidUpdate() {
    this.measureInput()
  }

  measureInput() {
    const {daypicker} = this
    if (daypicker) {
      let oneChar = 7.6
      let inputWidth = Math.ceil(daypicker.input.value.length * oneChar)
      if (this.state.inputWidth !== inputWidth) {
        this.setState({inputWidth})
      }
    }
  }

  onDayChange = (day: Date) => {
    if (day) this.props.onDayChange(day)
  }

  render() {
    let {from, to, day} = this.props
    from = Time.fakeZone(from)
    to = Time.fakeZone(to)
    let fakeDay = Time.fakeZone(day)

    return (
      <DayPickerInput
        ref={(r) => (this.daypicker = r)}
        value={Time.format(day, FORMAT)}
        formatDate={(date) => Time.format(date, FORMAT)}
        parseDate={parseDate}
        placeholder={FORMAT}
        onDayChange={this.onDayChange}
        dayPickerProps={{
          selectedDays: [fakeDay, {from, to}],
          todayButton: "TODAY",
          modifiers: {from, to}
        }}
        inputProps={{
          style: {width: this.state.inputWidth},
          className: "day-input"
        }}
      />
    )
  }
}

const parseDate = (string) => {
  const date = Time.parse(string, FORMAT, true)
  return date ? Time.fakeZone(date) : null
}
