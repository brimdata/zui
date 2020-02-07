/* @flow */
import React from "react"

import {XResultsTable} from "./ResultsTable"
import {useResizeObserver} from "../hooks/useResizeObserver"

export default function SearchResults() {
  let {ref, rect} = useResizeObserver()

  return (
    <div className="search-results" ref={ref}>
      <XResultsTable width={rect.width} height={rect.height} />
    </div>
  )
}
