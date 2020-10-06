import React from "react"

import ConnVersation from "../ConnVersation"
import PanelHeading from "./PanelHeading"
import {zng} from "zealot"

type Props = {
  log: zng.Record
  contextMenu: Function
}

const ConnPanel = ({log, contextMenu}: Props) => {
  if (!ConnVersation.shouldShow(log)) return null
  return (
    <div className="conn-versation-panel detail-panel">
      <PanelHeading>Conn History</PanelHeading>
      <ConnVersation log={log} contextMenu={contextMenu} />
    </div>
  )
}

export default ConnPanel
