import React from "react"
import {ButtonMenu} from "src/components/button-menu"
import {columnsToolbarMenu} from "src/app/menus/columns-toolbar-menu"
import Table from "src/js/state/Table"
import {useSelector} from "react-redux"

export function ColumnsToolbar() {
  const shape = useSelector(Table.getShape)
  const columnCount = useSelector(Table.getVisibleColumnCount)
  const hiddenCount = useSelector(Table.getHiddenColumnCount)

  if (!shape) return null

  const items = columnsToolbarMenu()
  return (
    <div
      className="repel flex-nowrap overflow-hidden h-toolbar border-b-solid border-more"
      style={{marginInline: "var(--gutter)"}}
    >
      <ButtonMenu items={items} label={"Columns Toolbar Menu"} />
      <p style={{whiteSpace: "nowrap"}}>
        {columnCount} Columns / {hiddenCount} Hidden
      </p>
    </div>
  )
}
