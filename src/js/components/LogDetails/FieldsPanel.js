/* @flow */

import {useSelector} from "react-redux"
import React from "react"

import Columns from "../../state/Columns"
import Log from "../../models/Log"
import PanelHeading from "./PanelHeading"
import SearchBar from "../../state/SearchBar"
import Tab from "../../state/Tab"
import VerticalTable from "../Tables/VerticalTable"
import menu from "../../electron/menu"

export default function FieldsPanel({log}: {log: Log}) {
  log = log.exclude("_td")
  let program = useSelector(SearchBar.getSearchProgram)
  let tableColumns = useSelector(Columns.getCurrentTableColumns)
  let space = useSelector(Tab.space)

  return (
    <div className="fields-table-panel detail-panel">
      <PanelHeading>Fields</PanelHeading>
      <VerticalTable
        descriptor={log.descriptor}
        log={log}
        rightClick={menu.fieldContextMenu(
          program,
          tableColumns.getColumns().map((c) => c.name),
          space
        )}
      />
    </div>
  )
}
