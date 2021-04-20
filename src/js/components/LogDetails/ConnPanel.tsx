import PanelHeading from "app/detail/PanelHeading"
import React from "react"
import {ZedRecord} from "zealot/zed"
import ConnVersation from "../ConnVersation"

type Props = {
  record: ZedRecord
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
