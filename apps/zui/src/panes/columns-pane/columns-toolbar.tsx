import React from "react"
import {Toolbar} from "src/components/toolbar"
import {ButtonMenu} from "src/components/button-menu"
import {useResultsContext} from "src/app/query-home"
import {columnsToolbarMenu} from "src/app/menus/columns-toolbar-menu"

export function ColumnsToolbar() {
  const {table} = useResultsContext()
  if (!table) return null
  const menu = columnsToolbarMenu.build(table)
  return (
    <Toolbar>
      <ButtonMenu items={menu.items} label={menu.label} />
      <p>
        {table.columnCount} Columns / {table.hiddenColumnCount} Hidden
      </p>
    </Toolbar>
  )
}
