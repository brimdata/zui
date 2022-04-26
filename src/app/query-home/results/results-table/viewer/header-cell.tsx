import {useDispatch} from "src/app/core/state"
import React, {useState} from "react"
import classNames from "classnames"
import {TableColumn, ColumnUpdates} from "src/js/state/Columns/types"
import {appendQuerySortBy} from "src/js/flows/searchBar/actions"
import Columns from "src/js/state/Columns"
import IconAsc from "src/js/components/icons/icon-asc"
import IconDesc from "src/js/components/icons/icon-desc"
import columnKey from "src/js/lib/columnKey"
import {toFieldPath} from "src/js/zql/toZql"
import {printColumnName} from "src/js/state/Columns/models/column"
import submitSearch from "src/app/query-home/flows/submit-search"

let oldWidth = null
let start = null
const add = document.addEventListener
const remove = document.removeEventListener

type Props = {
  column: TableColumn
  tableId: string
  sorts: {
    [key: string]: "asc" | "desc"
  }
}

function style(selector, key: string, value) {
  const el = document.querySelector(selector)
  if (!el) return

  el.style[key] = value
}

const HeaderCell = ({column, tableId, sorts}: Props) => {
  const dispatch = useDispatch()
  const [active, setActive] = useState(false)

  function onMouseMove(e: MouseEvent) {
    if (start !== null) {
      const moved = e.clientX - start
      const update: ColumnUpdates = {
        [columnKey(column.name)]: {width: oldWidth + moved},
      }
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

  const sorted = sorts[toFieldPath(column.name)] || ""
  function onClick() {
    dispatch(appendQuerySortBy(column.name, sorted === "asc" ? "desc" : "asc"))
    dispatch(submitSearch())
  }
  return (
    <div
      onClick={onClick}
      className={classNames("header-cell", {
        active,
        sorted,
      })}
      style={{width: column.width || 200}}
      role="columnheader"
    >
      {printColumnName(column.name)}
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

export default HeaderCell
