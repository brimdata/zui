import contextMenu from "src/app/detail/flows/contextMenu"
import {every} from "lodash"
import React from "react"
import {useDispatch} from "react-redux"
import {zed} from "@brimdata/zealot"
import connHistoryView from "../lib/connHistoryView"
import VerticalTable from "./Tables/VerticalTable"
import {Fieldset} from "./Typography"

const ORIG_FIELDS = ["orig_bytes", "orig_pkts", "orig_ip_bytes", "local_orig"]
const RESP_FIELDS = ["resp_bytes", "resp_pkts", "resp_ip_bytes", "local_resp"]

type Props = {
  record: zed.Record
}

function filter(record: zed.Record, names: string[]) {
  const fields = []

  names.forEach((n) => {
    const field = record.tryField(n)
    if (field) fields.push(field)
  })

  const type = new zed.TypeRecord(
    fields.map((f) => ({name: f.name, type: f.value.type}))
  )

  return new zed.Record(type, fields)
}

const ConnVersation = ({record}: Props) => {
  return (
    <div className="conn-versation">
      <Host
        title="Originator"
        className="originator"
        record={filter(record, ORIG_FIELDS)}
        ip={record.getField(["id", "orig_h"])}
        port={record.getField(["id", "orig_p"])}
      />
      <ConnHistory history={record.get("history").toString()} />
      <Host
        title="Responder"
        className="responder"
        record={filter(record, RESP_FIELDS)}
        ip={record.getField(["id", "resp_h"])}
        port={record.getField(["id", "resp_p"])}
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
  ip: zed.Field
  port: zed.Field
  record: zed.Record
}

const Host = ({className, title, ip, port, record}: HostProps) => {
  const dispatch = useDispatch()
  if (!ip) return null
  if (!port) return null

  function onRightClick(field, record) {
    dispatch(contextMenu(field, record))
  }

  return (
    <div className={`host ${className}`}>
      <Fieldset>{title}</Fieldset>
      <p
        onContextMenu={() => onRightClick(ip, record)}
        className={`ip ${ip.data.toString().length > 16 ? "small" : ""}`}
      >
        {ip.data.toString()}
      </p>
      <p onContextMenu={() => onRightClick(port, record)} className="port">
        {port.data.toString()}
      </p>
      <VerticalTable
        descriptor={record.fields}
        record={record}
        onRightClick={onRightClick}
      />
    </div>
  )
}

ConnVersation.shouldShow = (record: zed.Record) =>
  every(ORIG_FIELDS, (name) => record.has(name))

export default ConnVersation
