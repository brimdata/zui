import React from "react"
import {showContextMenu} from "src/js/lib/System"
import popupPosition from "../query-home/search-area/popup-position"
import {menus} from "./create-menu"

export function handleDropdown(
  menuId: string
): React.MouseEventHandler<HTMLElement> {
  return (event) => {
    const menu = menus.build(menuId)
    showContextMenu(menu, popupPosition(event.currentTarget))
  }
}
