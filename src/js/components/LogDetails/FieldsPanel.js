/* @flow */

import {useSelector} from "react-redux"
import React from "react"

import type {PanelProps} from "./"
import {getCurrentSpace} from "../../state/reducers/spaces"
import {getCurrentTableColumns} from "../../state/columns/selector"
import {getSearchProgram} from "../../state/selectors/searchBar"
import PanelHeading from "./PanelHeading"
import VerticalTable from "../Tables/VerticalTable"
import menu from "../../electron/menu"

export default function FieldsPanel({log}: PanelProps) {
  log = log.exclude("_td")
  let program = useSelector(getSearchProgram)
  let tableColumns = useSelector(getCurrentTableColumns)
  let space = useSelector(getCurrentSpace)

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
