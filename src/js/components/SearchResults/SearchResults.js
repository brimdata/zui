/* @flow */
import {useSelector} from "react-redux"
import React from "react"

import {XResultsTable} from "./ResultsTable"
import {useResizeObserver} from "../hooks/useResizeObserver"
import Columns from "../../state/Columns"
import Current from "../../state/Current"
import SearchBar from "../../state/SearchBar"
import menu from "../../electron/menu"

export default function SearchResults() {
  const {ref, rect} = useResizeObserver()

  const program = useSelector(SearchBar.getSearchProgram)
  const space = useSelector(Current.mustGetSpace)
  const columns = useSelector(Columns.getCurrentTableColumns)
    .getColumns()
    .map((c) => c.name)
  const createContextMenu = menu.searchFieldContextMenu(program, columns, space)

  return (
    <div className="search-results" ref={ref}>
      <XResultsTable
        width={rect.width}
        height={rect.height}
        createContextMenu={createContextMenu}
      />
    </div>
  )
}
