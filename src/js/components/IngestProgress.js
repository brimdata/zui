/* @flow */
import React from "react"

import MacSpinner from "./MacSpinner"

export default function IngestProgress() {
  return (
    <div className="ingest-progress-wrapper">
      <div className="ingest-progress">
        <p>Wating for space to become queryable...</p>
        <MacSpinner />
      </div>
    </div>
  )
}
