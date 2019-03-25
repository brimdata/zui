/* @flow */

import React from "react"

import type {PanelProps} from "./"
import ConnVersation from "../ConnVersation"
import PanelHeading from "./PanelHeading"

const ConnPanel = ({log}: PanelProps) => {
  if (!ConnVersation.shouldShow(log)) return null
  return (
    <div className="conn-versation-panel detail-panel">
      <PanelHeading>Conn History</PanelHeading>
      <ConnVersation log={log} />
    </div>
  )
}

export default ConnPanel
