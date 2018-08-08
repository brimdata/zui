import React from "react"
import {List, AutoSizer} from "react-virtualized"
import LogRow from "./LogRow"
import XSearchStats from "../connectors/XSearchStats"

export default class LogViewer extends React.PureComponent {
  render() {
    const {logs, appendToQuery, showDetail} = this.props
    const rowRenderer = ({key, index, style}) => {
      const log = logs[index]
      const prevLog = logs[index - 1]
      const logRow = (
        <LogRow
          key={key}
          log={log}
          prevLog={prevLog}
          style={style}
          showDetail={showDetail}
          appendToQuery={appendToQuery}
        />
      )

      if (index === 0) {
        return [<XSearchStats key="search-stats" />, logRow]
      } else {
        return logRow
      }
    }

    return (
      <AutoSizer>
        {({height, width}) => (
          <List
            className="log-viewer"
            width={width}
            height={height}
            rowCount={logs.length}
            rowHeight={25}
            rowRenderer={rowRenderer}
            overscanRowCount={10}
          />
        )}
      </AutoSizer>
    )
  }
}
