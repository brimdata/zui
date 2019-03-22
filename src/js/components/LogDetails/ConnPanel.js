/* @flow */

import React from "react"

import ConnVersation from "../ConnVersation"
import Log from "../../models/Log"

type Props = {log: Log}

const ConnPanel = ({log}: Props) => {
  if (!ConnVersation.shouldShow(log)) return null
  return (
    <div className="conn-versation-panel detail-panel">
      <h4 className="small-heading">Conn History</h4>
      <ConnVersation log={log} />
    </div>
  )
}

export default ConnPanel
