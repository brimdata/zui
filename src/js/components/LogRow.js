import React from "react"
import * as Time from "../lib/Time"
import {TsCell} from "./LogCell"
import XLogCell from "../connectors/XLogCell"

const exclude = {
  uid: true,
  ts: true,
  fuid: true
}

export default class LogRow extends React.PureComponent {
  render() {
    const {log, style, showDetail, appendToQuery, prevLog} = this.props
    const ts = Time.moment(log.cast("ts"))
    let tsHighlight = false
    if (prevLog) {
      const prevTs = Time.moment(prevLog.cast("ts"))
      tsHighlight = !ts
        .clone()
        .endOf("minute")
        .isSame(prevTs.endOf("minute"))
    }

    const cells = [
      <TsCell
        key="ts"
        ts={ts}
        highlight={tsHighlight}
        onClick={() => showDetail(log)}
      />
    ]

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
      <div className="log-row" style={style}>
        {cells}
      </div>
    )
  }
}
