/* @flow */
import {useDispatch} from "react-redux"
import React, {useState} from "react"
import classNames from "classnames"

import type {TableColumn} from "../../state/Columns/types"
import {appendQuerySortBy} from "../../flows/searchBar/actions"
import {submitSearch} from "../../flows/submitSearch/mod"
import Columns from "../../state/Columns"
import IconAsc from "../icons/icon-asc.svg"
import IconDesc from "../icons/icon-desc.svg"
import columnKey from "../../lib/columnKey"

let oldWidth = null
let start = null
let add = document.addEventListener
let remove = document.removeEventListener

type Props = {
  column: TableColumn,
  tableId: string,
  sorts: {[string]: "asc" | "desc"}
}

function style(selector, key: string, value) {
  let el = document.querySelector(selector)
  if (!el) return
  // $FlowFixMe
  el.style[key] = value
}

export default function HeaderCell({column, tableId, sorts}: Props) {
  let dispatch = useDispatch()
  let [active, setActive] = useState(false)

  function onMouseMove(e: MouseEvent) {
    if (start !== null) {
      const moved = e.clientX - start
      const update = {[columnKey(column)]: {width: oldWidth + moved}}
      dispatch(Columns.updateColumns(tableId, update))
    }
  }

  function onMouseUp(_e: MouseEvent) {
    style("body", "cursor", "")
    style(".viewer .list", "pointerEvents", "")
    remove("mousemove", onMouseMove)
    remove("mouseup", onMouseUp)
    setActive(false)
  }

  function onMouseDown(e) {
    style("body", "cursor", "col-resize")
    style(".viewer .list", "pointerEvents", "none")
    oldWidth = column.width
    start = e.clientX
    add("mousemove", onMouseMove)
    add("mouseup", onMouseUp)
    setActive(true)
  }

  let sorted = sorts[column.name] || ""
  function onClick() {
    dispatch(appendQuerySortBy(column.name, sorted === "asc" ? "desc" : "asc"))
    dispatch(submitSearch())
  }

  return (
    <div
      onClick={onClick}
      className={classNames("header-cell", column.type, {
        active,
        sorted
      })}
      style={{width: column.width || 200}}
    >
      {column.name}
      {sorted === "desc" && <IconDesc />}
      {sorted === "asc" && <IconAsc />}
      <div
        className="col-resizer"
        onMouseDown={onMouseDown}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
