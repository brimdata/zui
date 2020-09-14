import {useSelector} from "react-redux"
import React, {useState} from "react"

import {showContextMenu} from "../../lib/System"
import BrimTooltip from "../BrimTooltip"
import ColumnDescription from "./ColumnDescription"
import Columns from "../../state/Columns"
import Current from "../../state/Current"
import FieldCell from "../FieldCell"
import Log from "../../models/Log"
import PanelHeading from "./PanelHeading"
import SearchBar from "../../state/SearchBar"
import Table from "../Tables/Table"

type Props = {
  log: Log
  contextMenu: Function
}

// This needs to be optimized for performance.

export default function FieldsPanel({log, contextMenu}: Props) {
  log = log.exclude("_td")
  const program = useSelector(SearchBar.getSearchProgram)
  const tableColumns = useSelector(Columns.getCurrentTableColumns)
  const space = useSelector(Current.mustGetSpace)
  const columns = tableColumns.getColumns().map((c) => c.name)

  const fieldAt = (log, index) => log.getFieldAt(index)
  const onContextMenu = (log, index) => {
    const field = fieldAt(log, index)
    const m = contextMenu(program, columns, space)(field, log, false)
    return () => showContextMenu(m)
  }

  // Tooltip code
  const [hovered, setHovered] = useState({name: "", type: ""})
  const path = log.getString("_path")

  function enter(e, column) {
    setHovered(column)
  }

  return (
    <div className="fields-table-panel detail-panel">
      <PanelHeading>Fields</PanelHeading>
      <Table className="vertical-table">
        <tbody>
          {log.descriptor.map((column, index) => (
            <tr key={index}>
              <th>
                <span
                  data-tip="column-description"
                  data-place="right"
                  data-effect="solid"
                  data-delay-show={500}
                  onMouseEnter={(e) => enter(e, column)}
                >
                  {column.name}
                </span>
                {hovered.name.length > 0 && (
                  <BrimTooltip className="brim-tooltip-show-hover">
                    <ColumnDescription column={hovered} path={path} />
                  </BrimTooltip>
                )}
              </th>
              <td onContextMenu={onContextMenu(log, index)}>
                <FieldCell field={fieldAt(log, index)} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
