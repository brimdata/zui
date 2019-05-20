/* @flow */
import React from "react"

import type {Finding} from "../../state/reducers/investigation"
import {format} from "../../lib/Time"
import Log from "../../models/Log"
import VerticalTable from "../Tables/VerticalTable"

type Props = {finding: Finding}

export default function FindingDetail({finding}: Props) {
  function timeFormat(date) {
    return format(date, "MMM DD, YYYY HH:mm:ss")
  }

  let descriptor = [
    {type: "string", name: "Executed:"},
    {type: "string", name: "Space:"},
    {type: "string", name: "Span:"}
  ]

  let tuple = [
    timeFormat(finding.ts),
    finding.search.space,
    finding.search.span.map(timeFormat).join(" – ")
  ]

  let log = new Log(tuple, descriptor)
  return (
    <div className="finding-detail">
      <VerticalTable descriptor={descriptor} log={log} light />
    </div>
  )
}
