import React from "react"
import * as TimeWindow from "../lib/TimeWindow"
import {TsCell} from "./LogCell"
import XLogCell from "../connectors/XLogCell"
import classNames from "classnames"

const exclude = {
  uid: true,
  ts: true,
  fuid: true
}

export default class LogRow extends React.PureComponent {
  render() {
    const {
      log,
      style,
      showDetail,
      appendToQuery,
      prevLog,
      highlight
    } = this.props
    const ts = log.cast("ts")

    let tsHighlight = false
    if (prevLog) {
      const prevTs = prevLog.cast("ts")
      tsHighlight = !TimeWindow.inSameUnit([ts, prevTs], "minute")
    }

    const cells = [<TsCell key="ts" ts={ts} highlight={tsHighlight} />]

    for (let index = 1; index < log.tuple.length; index++) {
      const {name, value, type} = log.getFieldAt(index)
      if (exclude[name]) continue
      cells.push(
        <XLogCell
          key={index}
          appendToQuery={appendToQuery}
          name={name}
          type={type}
          value={value}
        />
      )
    }

    return (
      <div
        className={classNames("log-row", {highlight})}
        style={style}
        onClick={() => showDetail(log)}
      >
        {cells}
      </div>
    )
  }
}
