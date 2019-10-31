/* @flow */

import React, {useState} from "react"
import classNames from "classnames"

import type {RightClickBuilder} from "../../types"
import {getTooltipStyle} from "../../lib/MenuStyler"
import CellValueItem from "./CellValueItem"
import Field from "../../models/Field"
import Log from "../../models/Log"
import Tooltip from "../Tooltip"

type Props = {
  field: Field,
  log: Log,
  style?: Object,
  rightClick?: RightClickBuilder
}

export default function LogCell(props: Props) {
  let [hover, setHover] = useState(false)
  let [tooltipStyle, setTooltipStyle] = useState({})

  function handleMouseEnter(e) {
    setHover(true)
    setTooltipStyle(getTooltipStyle(e.currentTarget))
  }

  function handleMouseLeave() {
    setHover(false)
  }

  let {name, type} = props.field

  return (
    <div
      className={classNames(`log-cell ${type}`, {hover})}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={props.style}
    >
      <CellValueItem
        menu={props.rightClick}
        field={props.field}
        log={props.log}
        valueIndex={0}
      />
      {hover && (
        <Tooltip style={tooltipStyle}>
          <span className="field-name">{name}</span>
        </Tooltip>
      )}
    </div>
  )
}
