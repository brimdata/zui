import React from "react"
import XFilterTree from "../connectors/XFilterTree"

class History extends React.Component {
  render() {
    return (
      <div className="history-aside">
        <XFilterTree />
      </div>
    )
  }
}

export default History
