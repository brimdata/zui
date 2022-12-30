import React from "react"
import {createMenu, MenuItem} from "src/core/menu"
import {Toolbar} from "src/components/toolbar"
import {ButtonMenu} from "src/components/button-menu"

const columnToolbarMenu = createMenu("columnsToolbarMenu", () => {
  return [
    {label: "Expand All", click: () => alert("whoo hoo"), iconName: "expand"},
    {
      label: "Collapse All",
      iconName: "collapse",
      click: () => alert("whoo"),
    },
    {label: "Show All", iconName: "sidebar-toggle"},
    {label: "Hide All", iconName: "braces"},
    {label: "More", iconName: "chevron-up"},
    {label: "Less", iconName: "chevron-down"},
    {label: "Everything", iconName: "detach"},
    {label: "Everything", iconName: "chart"},
    {label: "Everything", iconName: "check"},
    {label: "Everything", iconName: "detach"},
    {label: "Everything", iconName: "detach"},
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
