import React from "react"

import ConnVersation from "../ConnVersation"
import {zng} from "zealot"
import PanelHeading from "app/detail/PanelHeading"

type Props = {
  record: zng.Record
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
