import classNames from "classnames"
import React, {useEffect, useRef, useState} from "react"
import {ZedField, ZedRecord} from "zealot/zed"
import {$Menu} from "../../electron/menu"
import lib from "../../lib"
import {showContextMenu} from "../../lib/System"
import FieldCell from "../FieldCell"

type Props = {
  field: ZedField
  record: ZedRecord
  menu: $Menu
}

const on = document.addEventListener
const off = document.removeEventListener

export default function SingleField({field, menu, record}: Props) {
  const [selected, setSelected] = useState(false)
  const cell = useRef<any>()

  function onClick(e) {
    setSelected(true)
    lib.win.selectText(e.currentTarget)
  }

  function onOutsideClick(e: MouseEvent) {
    if (cell.current && cell.current.contains(e.target)) return
    setSelected(false)
    off("click", onOutsideClick, false)
  }

  useEffect(() => {
    if (selected) {
      on("click", onOutsideClick, false)
    }
    return () => {
      off("click", onOutsideClick, false)
    }
  }, [selected])

  return (
    <div
      ref={cell}
      className={classNames("cell-value-item", {selected})}
      onClick={onClick}
      onContextMenu={() => showContextMenu(menu)}
    >
      <FieldCell field={field} record={record} />
    </div>
  )
}
