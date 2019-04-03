/* @flow */

import {every} from "lodash"
import React from "react"

import {Fieldset} from "./Typography"
import {rightClickFieldsPanel} from "../rightclick/detail"
import Log from "../models/Log"
import VerticalTable from "./Tables/VerticalTable"
import connHistoryView from "../lib/connHistoryView"

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
        log={log.only(...ORIG_FIELDS)}
        ip={log.get("id.orig_h")}
        port={log.get("id.orig_p")}
      />
      <ConnHistory history={log.get("history")} />
      <Host
        title="Responder"
        className="responder"
        log={log.only(...RESP_FIELDS)}
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

const Host = ({className, title = "", ip = "", port = "", log}) => {
  return (
    <div className={`host ${className}`}>
      <Fieldset>{title}</Fieldset>
      <p className={`ip ${ip.length > 16 ? "small" : ""}`}>{ip}</p>
      <p className="port">{port}</p>
      <VerticalTable
        descriptor={log.descriptor}
        log={log}
        rightClick={rightClickFieldsPanel}
      />
    </div>
  )
}

ConnVersation.shouldShow = log => every(ORIG_FIELDS, field => log.get(field))

export default ConnVersation
