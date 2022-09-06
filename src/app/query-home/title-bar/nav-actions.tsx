import React from "react"
import {useSelector} from "react-redux"
import {showHistoryPane} from "src/app/commands/show-history-pane"
import {useDispatch} from "src/app/core/state"
import TabHistory from "src/app/router/tab-history"
import Current from "src/js/state/Current"
import Layout from "src/js/state/Layout"
import styled from "styled-components"
import {IconButton} from "./icon-button"

const Actions = styled.div`
  display: flex;
  gap: 10px;
`

const Nav = styled.div`
  display: flex;
  gap: 2px;
`

export function NavActions() {
  const dispatch = useDispatch()
  const isEditing = useSelector(Layout.getIsEditingTitle)
  const history = useSelector(Current.getHistory)

  if (isEditing) return null
  return (
    <Actions>
      <Nav>
        <IconButton
          icon="left-arrow"
          onClick={() => dispatch(TabHistory.goBack())}
          disabled={!history.canGo(-1)}
        />
        <IconButton
          icon="right-arrow"
          disabled={!history.canGo(1)}
          onClick={() => dispatch(TabHistory.goForward())}
        />
      </Nav>
      <IconButton
        icon="history"
        title="Show Session History"
        size={16}
        onClick={() => showHistoryPane.run()}
      />
    </Actions>
  )
}
