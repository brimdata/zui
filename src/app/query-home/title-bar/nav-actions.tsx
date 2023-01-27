import React from "react"
import {useSelector} from "react-redux"
import {showHistoryPane} from "src/app/commands/show-history-pane"
import {useDispatch} from "src/app/core/state"
import TabHistory from "src/app/router/tab-history"
import {IconButton} from "src/components/icon-button"
import Current from "src/js/state/Current"
import Layout from "src/js/state/Layout"
import styled from "styled-components"

const Nav = styled.div`
  display: flex;
  button {
  }
`

export function NavActions() {
  const dispatch = useDispatch()
  const isEditing = useSelector(Layout.getIsEditingTitle)
  const history = useSelector(Current.getHistory)

  if (isEditing) return null
  return (
    <Nav>
      <IconButton
        label="Back"
        iconName="left-arrow"
        iconSize={18}
        click={() => dispatch(TabHistory.goBack())}
        enabled={history.canGo(-1)}
      />
      <IconButton
        label="Forward"
        iconName="right-arrow"
        iconSize={18}
        enabled={history.canGo(1)}
        click={() => dispatch(TabHistory.goForward())}
      />

      <IconButton
        label="History"
        description="Show Session History"
        iconName="history"
        iconSize={16}
        click={() => showHistoryPane.run()}
      />
    </Nav>
  )
}
