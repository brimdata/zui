import React from "react"
import {List, AutoSizer} from "react-virtualized"
import LogRow from "./LogRow"
import Log from "../models/Log"

export default class LogViewer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.onRowsRendered = this.onRowsRendered.bind(this)
  }

  onRowsRendered({startIndex}) {
    const {logs, setTimeCursor} = this.props
    setTimeCursor(logs[startIndex].cast("ts"))
  }

  render() {
    const {logs, appendToQuery, showDetail, logDetail, timeZone} = this.props
    const rowRenderer = ({key, index, style}) => (
      <LogRow
        key={key}
        log={logs[index]}
        prevLog={logs[index - 1]}
        timeZone={timeZone}
        highlight={Log.isSame(logs[index], logDetail)}
        style={style}
        showDetail={showDetail}
        appendToQuery={appendToQuery}
        index={index}
      />
    )
    return (
      <div className="log-viewer-wrapper">
        <AutoSizer>
          {({height, width}) => {
            return (
              <List
                onRowsRendered={this.onRowsRendered}
                className="log-viewer"
                width={width}
                height={height}
                rowCount={logs.length}
                rowHeight={25}
                rowRenderer={rowRenderer}
                overscanRowCount={2}
              />
            )
          }}
        </AutoSizer>
      </div>
    )
  }
}
