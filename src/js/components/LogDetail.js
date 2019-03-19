/* @flow */

import React from "react"

import ConnVersation from "./ConnVersation"
import FieldsTable from "./FieldsTable"
import InlineTable from "./InlineTable"
import Log from "../models/Log"
import UidTimeline from "./UidTimeline"

type Props = {
  log: Log,
  correlatedLogs: Log[],
  viewLogDetail: Function
}

export default class LogDetail extends React.Component<Props> {
  el: ?HTMLElement

  render() {
    const {log, correlatedLogs, viewLogDetail} = this.props

    const descriptor = [
      {type: "addr", name: "tx_hosts"},
      {type: "count", name: "count"}
    ]
    const tuples = [
      ["213.155.151.155", "155"],
      ["213.155.151.150", "144"],
      ["213.155.151.149", "132"],
      ["213.155.151.151", "132"],
      ["213.155.151.180", "130"]
    ]

    const descriptor1 = [
      {type: "addr", name: "rx_hosts"},
      {type: "count", name: "count"}
    ]
    const tuples1 = [
      ["213.155.151.155", "155"],
      ["213.155.151.150", "144"],
      ["213.155.151.149", "132"],
      ["213.155.151.151", "132"],
      ["213.155.151.180", "130"]
    ]
    const rxLogs = tuples1.map(t => new Log(t, descriptor1))
    const txLogs = tuples.map(t => new Log(t, descriptor))

    return (
      <div className="log-detail">
        <div className="fields-table-panel">
          <h4 className="small-heading">Fields</h4>
          <FieldsTable log={log} />
        </div>

        {correlatedLogs.length > 1 && (
          <div className="correlated-logs-panel">
            <h4 className="small-heading">Correlated Logs</h4>
            <UidTimeline
              currentLog={log}
              logs={correlatedLogs}
              viewLogDetail={viewLogDetail}
            />
          </div>
        )}

        {ConnVersation.shouldShow(log) && (
          <div className="conn-versation-panel">
            <ConnVersation log={log} />
          </div>
        )}

        <InlineTable
          logs={[new Log(["12,231"], [{type: "count", name: "count"}])]}
        />
        <InlineTable logs={txLogs} />
        <InlineTable logs={rxLogs} />
      </div>
    )
  }
}
