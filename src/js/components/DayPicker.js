import React from "react"
import moment from "moment"
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
    const {from, to} = this.props

    return (
      <div className="text-input-wrapper">
        <DayPickerInput
          ref={r => (this.daypicker = r)}
          value={moment.utc(this.props.day).format(FORMAT)}
          formatDate={formatDate}
          parseDate={parseDate}
          placeholder={FORMAT}
          onDayChange={this.onDayChange}
          dayPickerProps={{
            selectedDays: [this.props.day, {from, to}],
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
  const date = moment(string, FORMAT, true)
  if (date.isValid()) return date.toDate()
  else return null
}

function formatDate(date) {
  return moment.utc(date).format(FORMAT)
}
