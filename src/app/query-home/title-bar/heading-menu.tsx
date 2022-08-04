import styled from "styled-components"
import {MenuItemConstructorOptions} from "electron"
import React, {useRef} from "react"
import {useBrimApi} from "src/app/core/context"
import {useDispatch} from "src/app/core/state"
import {showContextMenu} from "src/js/lib/System"
import Layout from "src/js/state/Layout"
import popupPosition from "../search-area/popup-position"
import getQueryHeaderMenu from "../toolbar/flows/get-query-header-menu"
import getQueryListMenu from "../toolbar/flows/get-query-list-menu"
import {IconButton} from "./icon-button"
import {useActiveQuery} from "./context"

const MenuButton = styled(IconButton)`
  height: 22px;
  width: 22px;
`

export function HeadingMenu() {
  const active = useActiveQuery()
  const dispatch = useDispatch()
  const api = useBrimApi()
  const ref = useRef<HTMLButtonElement>()

  const onClick = () => {
    const savedQueries = dispatch(getQueryListMenu())
    const queryMenu = dispatch(
      getQueryHeaderMenu({
        handleRename: () => dispatch(Layout.showTitleForm("update")),
      })
    )
    const editOptions = [
      {
        label: "Go to Latest Version",
        click: () => api.queries.open(active.query.id),
        visible: active.isOutdated(),
      },
    ] as MenuItemConstructorOptions[]
    const menu = [
      ...queryMenu,
      ...editOptions,
      {type: "separator"},
      {label: "Switch Query", submenu: savedQueries},
    ] as MenuItemConstructorOptions[]
    showContextMenu(menu, popupPosition(ref.current))
  }

  return <MenuButton icon="three-dots-stacked" onClick={onClick} ref={ref} />
}
