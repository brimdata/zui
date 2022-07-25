import React from "react"
import {useDispatch} from "src/app/core/state"
import TabHistory from "src/app/router/tab-history"
import Layout from "src/js/state/Layout"
import styled from "styled-components"
import {IconButton} from "./icon-button"

const Actions = styled.div`
  display: flex;
  padding: 0 16px;
  gap: 10px;
  position: absolute;
  &:first-child {
    left: 0px;
  }
  &:last-child {
    right: 0px;
  }
`

const Nav = styled.div`
  display: flex;
  gap: 2px;
`

export function NavActions() {
  const dispatch = useDispatch()
  return (
    <Actions>
      <Nav>
        <IconButton
          icon="left-arrow"
          onClick={() => dispatch(TabHistory.goBack())}
        />
        <IconButton
          icon="right-arrow"
          onClick={() => dispatch(TabHistory.goForward())}
        />
      </Nav>
      <IconButton
        icon="history"
        onClick={() => dispatch(Layout.setCurrentPaneName("history"))}
      />
    </Actions>
  )
}
