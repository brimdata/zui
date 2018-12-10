import React from "react"
import * as Doc from "../lib/Doc"
import * as Time from "../lib/Time"
import DayPickerInput from "react-day-picker/DayPickerInput"

const FORMAT = "MMM D, YYYY"

export default class DayPicker extends React.Component {
  constructor(props) {
    super(props)
    this.onDayChange = this.onDayChange.bind(this)
    this.state = {inputWidth: 70}
  }

  componentDidMount() {
    this.measureInput()
  }

  componentDidUpdate() {
    this.measureInput()
  }

  measureInput() {
    if (this.daypicker) {
      const parent = Doc.id("measure-layer")
      const span = document.createElement("span")
      span.innerHTML = this.daypicker.input.value
      span.className = "thin-button"
      span.style.padding = "0 5px"
      parent.append(span)
      const {width} = span.getBoundingClientRect()
      span.remove()
      const inputWidth = Math.floor(width)
      if (this.state.inputWidth !== inputWidth) {
        this.setState({inputWidth: Math.floor(width)})
      }
    }
  }

  onDayChange(day) {
    if (day) this.props.onDayChange(day)
  }

  render() {
    let {from, to, day} = this.props
    from = Time.fakeZone(from)
    to = Time.fakeZone(to)
    let fakeDay = Time.fakeZone(day)

    return (
      <DayPickerInput
        ref={r => (this.daypicker = r)}
        value={Time.format(day, FORMAT)}
        formatDate={date => Time.format(date, FORMAT)}
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

const parseDate = string => {
  const date = Time.parse(string, FORMAT, true)
  return date ? Time.fakeZone(date) : null
}
