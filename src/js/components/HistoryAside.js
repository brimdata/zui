import React from "react"
import XFilterTree from "../connectors/XFilterTree"

class History extends React.Component {
  render() {
    return (
      <div className="history-aside">
        <header>
          <h3 className="tiny-heading">Search History</h3>
          <div onClick={this.props.clearFilterTree} className="clear-button">
            Clear
          </div>
        </header>
        <XFilterTree />
      </div>
    )
  }
}

export default History
