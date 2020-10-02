import {every} from "lodash"
import {useSelector} from "react-redux"
import React from "react"

import {Fieldset} from "./Typography"
import {showContextMenu} from "../lib/System"
import Columns from "../state/Columns"
import Current from "../state/Current"
import SearchBar from "../state/SearchBar"
import VerticalTable from "./Tables/VerticalTable"
import connHistoryView from "../lib/connHistoryView"
import {zng} from "zealot"

const ORIG_FIELDS = ["orig_bytes", "orig_pkts", "orig_ip_bytes", "local_orig"]
const RESP_FIELDS = ["resp_bytes", "resp_pkts", "resp_ip_bytes", "local_resp"]

type Props = {
  log: zng.Record
  contextMenu: Function
}

function filter(record: zng.Record, names: string[]) {
  const cols = []
  const vals = []

  names.forEach((n) => {
    const i = record.getColumnNames().indexOf(n)
    cols.push(record.type[i])
    vals.push(record.value[i])
  })

  return new zng.Record(cols, vals)
}

const ConnVersation = ({log, contextMenu}: Props) => {
  return (
    <div className="conn-versation">
      <Host
        title="Originator"
        className="originator"
        log={filter(log, ORIG_FIELDS)}
        ip={log.getField("id.orig_h")}
        port={log.getField("id.orig_p")}
        contextMenu={contextMenu}
      />
      <ConnHistory history={log.get("history").toString()} />
      <Host
        title="Responder"
        className="responder"
        log={filter(log, RESP_FIELDS)}
        ip={log.getField("id.resp_h")}
        port={log.getField("id.resp_p")}
        contextMenu={contextMenu}
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

type HostProps = {
  className: string
  title: string
  ip: zng.Field
  port: zng.Field
  log: zng.Record
  contextMenu: Function
}

const Host = ({className, title, ip, port, log, contextMenu}: HostProps) => {
  const program = useSelector(SearchBar.getSearchProgram)
  const tableColumns = useSelector(Columns.getCurrentTableColumns)
  const space = useSelector(Current.mustGetSpace)
  const rightClick = contextMenu(
    program,
    tableColumns.getColumns().map((c) => c.name),
    space
  )

  if (!ip) return null
  if (!port) return null

  function onIpContextMenu() {
    showContextMenu(rightClick(ip, log, false))
  }

  function onPortContextMenu() {
    showContextMenu(rightClick(port, log, false))
  }

  return (
    <div className={`host ${className}`}>
      <Fieldset>{title}</Fieldset>
      <p
        onContextMenu={onIpContextMenu}
        className={`ip ${ip.data.toString().length > 16 ? "small" : ""}`}
      >
        {ip.data.toString()}
      </p>
      <p onContextMenu={onPortContextMenu} className="port">
        {port.data.toString()}
      </p>
      <VerticalTable descriptor={log.type} log={log} rightClick={rightClick} />
    </div>
  )
}

ConnVersation.shouldShow = (log: zng.Record) =>
  every(ORIG_FIELDS, (name) => log.has(name))

export default ConnVersation
