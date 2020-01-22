/* @flow */

import {every} from "lodash"
import {useSelector} from "react-redux"
import React from "react"

import {Fieldset} from "./Typography"
import {showContextMenu} from "../lib/System"
import Columns from "../state/Columns"
import Log from "../models/Log"
import SearchBar from "../state/SearchBar"
import Tab from "../state/Tab"
import VerticalTable from "./Tables/VerticalTable"
import connHistoryView from "../lib/connHistoryView"
import menu from "../electron/menu"

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
        ip={log.getField("id.orig_h")}
        port={log.getField("id.orig_p")}
      />
      <ConnHistory history={log.get("history")} />
      <Host
        title="Responder"
        className="responder"
        log={log.only(...RESP_FIELDS)}
        ip={log.getField("id.resp_h")}
        port={log.getField("id.resp_p")}
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

const Host = ({className, title, ip, port, log}) => {
  let program = useSelector(SearchBar.getSearchProgram)
  let tableColumns = useSelector(Columns.getCurrentTableColumns)
  let space = useSelector(Tab.space)
  let rightClick = menu.fieldContextMenu(
    program,
    tableColumns.getColumns().map((c) => c.name),
    space
  )

  function onIpContextMenu() {
    showContextMenu(rightClick(ip.toBrimField(), log, false))
  }

  function onPortContextMenu() {
    showContextMenu(rightClick(port.toBrimField(), log, false))
  }

  return (
    <div className={`host ${className}`}>
      <Fieldset>{title}</Fieldset>
      <p
        onContextMenu={onIpContextMenu}
        className={`ip ${ip.value.length > 16 ? "small" : ""}`}
      >
        {ip.value}
      </p>
      <p onContextMenu={onPortContextMenu} className="port">
        {port.value}
      </p>
      <VerticalTable
        descriptor={log.descriptor}
        log={log}
        rightClick={rightClick}
      />
    </div>
  )
}

ConnVersation.shouldShow = (log) =>
  every(ORIG_FIELDS, (field) => log.get(field))

export default ConnVersation
