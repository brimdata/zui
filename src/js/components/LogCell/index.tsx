import {typeClassNames} from "app/core/utils/type-class-names"
import classNames from "classnames"
import React, {useState} from "react"
import {zed} from "zealot"
import {RightClickBuilder} from "../../types"
import Tooltip from "../Tooltip"
import CompoundField from "./CompoundField"
import SingleField from "./SingleField"

type Props = {
  field: zed.Field
  log: zed.Record
  style?: Object
  rightClick: RightClickBuilder
}

const getTooltipStyle = (el: Element) => {
  if (!el) return {}
  const {top, left} = el.getBoundingClientRect()
  return {top: top - 21, left: left + 4}
}

export default function LogCell({field, style, rightClick, log}: Props) {
  const [hover, setHover] = useState(false)
  const [tooltipStyle, setTooltipStyle] = useState({})
  const data = field.data
  const name = field.name

  function handleMouseEnter(e) {
    setHover(true)
    setTooltipStyle(getTooltipStyle(e.currentTarget))
  }

  function handleMouseLeave() {
    setHover(false)
  }
  return (
    <div
      className={classNames(`log-cell`, typeClassNames(data), {hover})}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
    >
      <FieldSwitch field={field} log={log} menuBuilder={rightClick} />
      {hover && (
        <Tooltip style={tooltipStyle}>
          <span className="field-name">{name}</span>
        </Tooltip>
      )}
    </div>
  )
}

type FieldSwitchProps = {
  field: zed.Field
  log: zed.Record
  menuBuilder: RightClickBuilder
}

function FieldSwitch({field, log, menuBuilder}: FieldSwitchProps) {
  if (field.data instanceof zed.Primitive) {
    const menu = menuBuilder(field, log, false)
    return <SingleField field={field} menu={menu} record={log} />
  } else {
    return <CompoundField field={field} log={log} menuBuilder={menuBuilder} />
  }
}
