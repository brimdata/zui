import React from "react"
import {useSelector} from "react-redux"
import {IconButton} from "src/components/icon-button"
import Current from "src/js/state/Current"
import Layout from "src/js/state/Layout"
import {PaneName} from "src/js/state/Layout/types"
import styled from "styled-components"

const Nav = styled.div`
  display: flex;
  button {
  }
`

export function NavActions() {
  const isEditing = useSelector(Layout.getIsEditingTitle)
  const history = useSelector(Current.getHistory)

  if (isEditing) return null
  return (
    <Nav>
      <IconButton
        label="Back"
        iconName="left-arrow"
        iconSize={18}
        command="session.goBack"
        enabled={history.canGo(-1)}
      />
      <IconButton
        label="Forward"
        iconName="right-arrow"
        iconSize={18}
        enabled={history.canGo(1)}
        command="session.goForward"
      />

      <IconButton
        label="History"
        description="Show Session History"
        iconName="history"
        iconSize={16}
        command="panes.activate"
        args={["history" as PaneName]}
      />
    </Nav>
  )
}
