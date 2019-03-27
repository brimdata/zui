/* @flow */

import React from "react"

import HorizontalTable from "../Tables/HorizontalTable"
import InlineTableLoading from "../InlineTableLoading"
import Log from "../../models/Log"

type Props = {
  logs: Log[],
  expect: number,
  name: string
}

export default function AsyncTable({logs, expect, name}: Props) {
  if (logs.length === 0) {
    return <InlineTableLoading title={`Loading ${name}...`} rows={expect} />
  } else {
    return (
      <HorizontalTable
        headers={logs[0].descriptor}
        data={logs.map(log => log.getFields().map(f => ({...f})))}
      />
    )
  }
}
