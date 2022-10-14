import styled from "styled-components"
import React from "react"
import {IconButton} from "./icon-button"
import {useActiveQuery} from "./context"
import {savedQueryMenu} from "src/app/menus/saved-query-menu"

const MenuButton = styled(IconButton)`
  height: 22px;
  width: 22px;
`

export function HeadingMenu() {
  const active = useActiveQuery()

  return (
    <MenuButton
      icon="three-dots-stacked"
      onClick={(e) => savedQueryMenu.build(active).showUnder(e.currentTarget)}
    />
  )
}
