import React from "react"
import * as Time from "../lib/Time"
import DayPickerInput from "react-day-picker/DayPickerInput"

export default class DayPicker extends React.Component {
  constructor(props) {
    super(props)
    this.onDayChange = this.onDayChange.bind(this)
  }

  onDayChange(day) {
    if (day) this.props.onDayChange(day)
  }

  render() {
    let {from, to, day} = this.props
    from = convertToLocalDay(from)
    to = convertToLocalDay(to)
    day = convertToLocalDay(day)
    return (
      <div className="text-input-wrapper">
        <DayPickerInput
          ref={r => (this.daypicker = r)}
          value={Time.format(day, FORMAT)}
          formatDate={formatDate}
          parseDate={parseDate}
          placeholder={FORMAT}
          onDayChange={this.onDayChange}
          dayPickerProps={{
            selectedDays: [day, {from, to}],
            todayButton: "TODAY",
            modifiers: {from, to}
          }}
          inputProps={{
            size: 11
          }}
        />
      </div>
    )
  }
}

const FORMAT = "MMM D, YYYY"

function parseDate(string) {
  const date = Time.moment(string, FORMAT, true)
  if (date.isValid()) return convertToLocalDay(date.toDate())
  else return null
}

function formatDate(date) {
  return Time.moment(date).format(FORMAT)
}

const convertToLocalDay = date => {
  const t = Time.moment(date)
  return new Date(t.get("year"), t.get("month"), t.get("date"))
}
