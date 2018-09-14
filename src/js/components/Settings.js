import React from "react"
import * as Time from "../lib/Time"

class Settings extends React.Component {
  render() {
    const {timeZone, setTimeZone} = this.props

    return (
      <div className="settings">
        <h1>Settings</h1>
        <form>
          <div>
            <label>Time Zone:</label>
            <select
              onChange={e => setTimeZone(e.currentTarget.value)}
              value={timeZone}
            >
              {Time.zones().map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>
    )
  }
}

export default Settings
