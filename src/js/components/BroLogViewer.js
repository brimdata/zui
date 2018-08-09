import React from "react"
import BroLogRow from "./BroLogRow"

export default class BroLogViewer extends React.Component {
  render() {
    let {broLogs} = this.props
    let rows = []
    let tsHeader

    for (let i in broLogs) {
      let log = broLogs[i]
      let ts = log.cast("ts")
      let tsMinute = ts.endOf("minute")

      if (!tsHeader || !tsHeader.isSame(tsMinute)) {
        tsHeader = tsMinute
        rows.push(<TsHeader key={tsHeader.format()} ts={tsHeader} />)
      }

      rows.push(
        <BroLogRow
          key={i}
          broLog={log}
          appendToQuery={this.props.appendToQuery}
        />
      )
    }

    return (
      <div className="bro-log-viewer-wrapper">
        <div className="bro-log-table">{rows}</div>
      </div>
    )
  }
}

const TsHeader = ({ts}) => (
  <div className="ts-header">
    <p>
      <span className="date">{ts.format("MMM DD, YYYY")}</span>
      <span className="time">{ts.format("HH:mm")}</span>
    </p>
  </div>
)
