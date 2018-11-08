import React from "react"
import {List, AutoSizer} from "react-virtualized"
import LogRow from "./LogRow"
import Log from "../models/Log"

export default class LogViewer extends React.PureComponent {
  render() {
    const {logs, logDetail, timeZone} = this.props
    const rowRenderer = ({key, index, style, isScrolling}) => (
      <LogRow
        key={key}
        log={logs[index]}
        timeZone={timeZone}
        highlight={Log.isSame(logs[index], logDetail)}
        style={style}
        isScrolling={isScrolling}
        index={index}
      />
    )
    return (
      <div className="log-viewer-wrapper">
        <AutoSizer>
          {({height, width}) => {
            return (
              <List
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
