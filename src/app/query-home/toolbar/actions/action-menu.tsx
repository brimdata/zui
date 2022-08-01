import Icon from "src/app/core/icon-temp"
import React from "react"
import {showContextMenu} from "src/js/lib/System"
import styled from "styled-components"
import {toMenu} from "./action-button"
import {GUTTER} from "./action-buttons"
import Button from "./button"

const Menu = styled(Button)`
  padding-right: 3px;
  min-width: 22px;
  flex-shrink: 0;
  margin-left: ${GUTTER / 2}px;

  .icon i svg {
    width: 9px;
    height: 9px;
  }
`

export default function ActionMenu({actions}) {
  if (actions.length === 0) return null
  return (
    <Menu
      icon={<Icon name="double-chevron-right" />}
      onClick={() => showContextMenu(toMenu(actions))}
    />
  )
}
