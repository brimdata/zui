/* @flow */

import React from "react"

import ConnVersation from "../ConnVersation"
import Log from "../../models/Log"
import PanelHeading from "./PanelHeading"

const ConnPanel = ({log}: {log: Log}) => {
  if (!ConnVersation.shouldShow(log)) return null
  return (
    <div className="conn-versation-panel detail-panel">
      <PanelHeading>Conn History</PanelHeading>
      <ConnVersation log={log} />
    </div>
  )
}

export default ConnPanel
