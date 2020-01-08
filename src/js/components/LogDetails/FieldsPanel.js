/* @flow */

import {useSelector} from "react-redux"
import React from "react"

import {getCurrentTableColumns} from "../../state/columns/selector"
import {getSearchProgram} from "../../state/selectors/searchBar"
import Log from "../../models/Log"
import PanelHeading from "./PanelHeading"
import Tab from "../../state/tab"
import VerticalTable from "../Tables/VerticalTable"
import menu from "../../electron/menu"

export default function FieldsPanel({log}: {log: Log}) {
  log = log.exclude("_td")
  let program = useSelector(getSearchProgram)
  let tableColumns = useSelector(getCurrentTableColumns)
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
