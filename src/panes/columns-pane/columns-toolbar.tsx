import React from "react"
import {createMenu, MenuItem} from "src/core/menu"
import {Toolbar} from "src/components/toolbar"
import {ButtonMenu} from "src/components/button-menu"

const columnToolbarMenu = createMenu("columnsToolbarMenu", () => {
  return [
    {label: "Expand All", click: () => {}, iconName: "expand"},
    {
      label: "Collapse All",
      iconName: "collapse",
      click: () => {},
    },
    {label: "Show All", iconName: "show"},
    {label: "Hide All", iconName: "hide"},
  ] as MenuItem[]
})

export function ColumnsToolbar() {
  const menu = columnToolbarMenu.build()
  return (
    <Toolbar>
      <ButtonMenu menu={menu} />
    </Toolbar>
  )
}
