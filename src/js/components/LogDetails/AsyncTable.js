import React from "react"

import InlineTable from "../InlineTable"
import InlineTableLoading from "../InlineTableLoading"

export const AsyncTable = ({logs, expect, name}) => {
  if (logs.length === 0) {
    return <InlineTableLoading title={`Loading ${name}...`} rows={expect} />
  } else {
    return <InlineTable logs={logs} />
  }
}
