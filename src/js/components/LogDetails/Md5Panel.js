import React from "react"

import InlineTable from "../InlineTable"

const Md5Panel = ({relatedLogs}) => {
  const {md5, tx, rx} = relatedLogs
  if (!md5.length && !tx.length && !rx.length) return null

  return (
    <div className="hash-correlation detail-panel">
      <h4 className="small-heading">Md5 Correlation</h4>
      <InlineTable logs={md5} />
      <div className="two-column">
        <InlineTable logs={tx} />
        <InlineTable logs={rx} />
      </div>
    </div>
  )
}

export default Md5Panel
