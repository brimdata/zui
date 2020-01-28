/* @flow */

import {useSelector} from "react-redux"
import React, {useState} from "react"

import {Paragraph, Stats} from "../Typography"
import {showContextMenu} from "../../lib/System"
import Columns from "../../state/Columns"
import FieldCell from "../FieldCell"
import Log from "../../models/Log"
import PanelHeading from "./PanelHeading"
import SearchBar from "../../state/SearchBar"
import Tab from "../../state/Tab"
import Table from "../Tables/Table"
import Tip from "../Tip"
import ZeekDocs from "../../services/ZeekDocs"
import menu from "../../electron/menu"

export default function FieldsPanel({log}: {log: Log}) {
  log = log.exclude("_td")
  let program = useSelector(SearchBar.getSearchProgram)
  let tableColumns = useSelector(Columns.getCurrentTableColumns)
  let space = useSelector(Tab.space)
  let columns = tableColumns.getColumns().map((c) => c.name)

  const fieldAt = (log, index) => log.getFieldAt(index).toBrimField()

  const onContextMenu = (log, index) => {
    let field = fieldAt(log, index)
    let m = menu.fieldContextMenu(program, columns, space)(field, log, false)
    return () => showContextMenu(m)
  }

  // Tooltip code

  let [show, setShow] = useState(false)
  let [hovered, setHovered] = useState({})
  let [anchor, setAnchor] = useState(null)
  let _path = log.get("_path")

  function enter(e, column) {
    setHovered(column)
    setAnchor(e.currentTarget)
    setShow(true)
  }

  return (
    <div className="fields-table-panel detail-panel">
      <PanelHeading>Fields</PanelHeading>
      <Tip show={show} anchor={anchor}>
        <Paragraph>
          {hovered.name} <Stats>{hovered.type}</Stats>
        </Paragraph>
        <Paragraph>{ZeekDocs.describe(_path, hovered.name)}</Paragraph>
      </Tip>
      <Table className="vertical-table">
        <tbody>
          {log.descriptor.map((column, index) => (
            <tr key={index}>
              <th>
                <span
                  onMouseEnter={(e) => enter(e, column)}
                  onMouseLeave={() => setShow(false)}
                >
                  {column.name}
                </span>
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
