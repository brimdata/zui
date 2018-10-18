/* @flow */

import React from "react"
import connHistoryView from "../lib/connHistoryView"
import FieldsTable from "./FieldsTable"
import every from "lodash/every"
import Log from "../models/Log"

const ORIG_FIELDS = ["orig_bytes", "orig_pkts", "orig_ip_bytes", "local_orig"]
const RESP_FIELDS = ["resp_bytes", "resp_pkts", "resp_ip_bytes", "local_resp"]

type Props = {
  log: Log
}

const ConnVersation = ({log}: Props) => {
  return (
    <div className="conn-versation">
      <Host
        title="Originator"
        className="originator"
        fieldNames={ORIG_FIELDS}
        log={log}
        ip={log.get("id.orig_h")}
        port={log.get("id.orig_p")}
      />
      <ConnHistory history={log.get("history")} />
      <Host
        title="Responder"
        className="responder"
        fieldNames={RESP_FIELDS}
        log={log}
        ip={log.get("id.resp_h")}
        port={log.get("id.resp_p")}
      />
    </div>
  )
}

const ConnHistory = ({history = ""}) => (
  <div className="history">
    {connHistoryView(history).map((view, i) => (
      <div key={i} className={`history-packet arrow-${view.direction}`}>
        <span>{view.text}</span>
        <hr />
        <svg className="triangle" viewBox="0 0 18 12">
          <polygon points="18 6 0 12 2.66453526e-15 0" />
        </svg>
      </div>
    ))}
  </div>
)

const Host = ({className, title = "", ip = "", port = "", fieldNames, log}) => (
  <div className={`host ${className}`}>
    <h4 className="small-heading">{title}</h4>
    <p className={`ip ${ip.length > 16 ? "small" : ""}`}>{ip}</p>
    <p className="port">{port}</p>
    <FieldsTable log={log} only={fieldNames} />
  </div>
)

ConnVersation.shouldShow = log => every(ORIG_FIELDS, field => log.get(field))

export default ConnVersation
