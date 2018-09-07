import React from "react"
import TimeWindowPicker from "./TimeWindowPicker"

class TimeWindowInput extends React.Component {
  render() {
    const {timeWindow, setOuterTimeWindow} = this.props

    return (
      <div className="time-window-input">
        <TimeWindowPicker
          onChange={setOuterTimeWindow}
          timeWindow={timeWindow}
        />
      </div>
    )
  }
}

export default TimeWindowInput
