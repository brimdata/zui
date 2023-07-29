import PanelHeading from "src/app/detail/PanelHeading"
import React from "react"
import * as zed from "@brimdata/zed-js"
import ConnVersation from "../ConnVersation"

type Props = {
  record: zed.Record
}

const ConnPanel = ({record}: Props) => {
  if (!ConnVersation.shouldShow(record)) return null
  return (
    <section className="conn-versation-panel detail-panel">
      <PanelHeading>Conn History</PanelHeading>
      <ConnVersation record={record} />
    </section>
  )
}

export default ConnPanel
