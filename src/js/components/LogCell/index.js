/* @flow */

import React, {useState} from "react"
import classNames from "classnames"

import {XViewerFieldActions} from "../FieldActions"
import {clearTextSelection, selectText} from "../../lib/Doc"
import {getTooltipStyle} from "../../lib/MenuStyler"
import CellValue from "./CellValue"
import Field from "../../models/Field"
import Log from "../../models/Log"
import Tooltip from "../Tooltip"
import useContextMenu from "../../hooks/useContextMenu"

type Props = {
  field: Field,
  log: Log,
  style?: Object
}

export default function LogCell(props: Props) {
  let [hover, setHover] = useState(false)
  let [tooltipStyle, setTooltipStyle] = useState({})
  let menu = useContextMenu()

  function handleMouseEnter(e) {
    setHover(true)
    setTooltipStyle(getTooltipStyle(e.currentTarget))
  }

  function handleMouseLeave() {
    setHover(false)
  }

  function handleRightClick(e) {
    clearTextSelection()
    e.stopPropagation()
    setHover(true)
    menu.handleOpen(e)
  }

  function handleRightClickDismiss(e) {
    clearTextSelection()
    e.stopPropagation()
    setHover(false)
    menu.handleClose()
  }

  let {name, type} = props.field

  return (
    <div
      className={classNames(`log-cell ${type}`, {
        active: menu.show,
        hover
      })}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleRightClick}
      onClick={e => selectText(e.currentTarget)}
      style={props.style}
    >
      <CellValue field={props.field} />

      {hover && (
        <Tooltip style={tooltipStyle}>
          <span className="field-name">{name}</span>
        </Tooltip>
      )}

      {menu.show && (
        <XViewerFieldActions
          log={props.log}
          field={props.field}
          style={menu.style}
          onClose={handleRightClickDismiss}
        />
      )}
    </div>
  )
}
