import React from "react"
import TimeWindowPicker from "./TimeWindowPicker"

class TimeWindowInput extends React.Component {
  render() {
    const {timeWindow, setTimeWindow} = this.props

    return (
      <div className="time-window-input">
        <TimeWindowPicker onChange={setTimeWindow} timeWindow={timeWindow} />
      </div>
    )
  }
}

export default TimeWindowInput
