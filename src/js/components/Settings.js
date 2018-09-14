import React from "react"
import * as Time from "../lib/Time"

class Settings extends React.Component {
  render() {
    const {timeZone, setTimeZone, onSave} = this.props

    return (
      <div className="settings">
        <h1 className="large-heading">Settings</h1>
        <form>
          <div>
            <label>Timezone</label>
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
          <div>
            <button onClick={onSave} type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default Settings
