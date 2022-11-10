import React from "react"

import MacSpinner from "./MacSpinner"

export default function TabSearchLoading() {
  return (
    <div className="tab-search-loading">
      <div className="message">
        <p>Loading data into pool...</p>
        <MacSpinner />
      </div>
    </div>
  )
}
