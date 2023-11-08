import React, {CSSProperties} from "react"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import AppErrorBoundary from "src/js/components/AppErrorBoundary"
import Appearance from "src/js/state/Appearance"
import Tabs from "src/js/state/Tabs"
import styled from "styled-components"

const BG = styled.main`
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  grid-area: main;
  overflow: hidden;
  background: white;
  z-index: 1;
  margin: 10px;
  margin-top: 2px;
  border-radius: 6px;
  box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.1);
`

export function isInteractive() {
  return (dispatch, getState) => {
    const active = Tabs.getActive(getState())
    const preview = Tabs.getPreview(getState())
    if (active === preview) {
      dispatch(Tabs.preview(null))
    }
  }
}

export function MainArea({children}) {
  const dispatch = useDispatch()
  const touched = () => dispatch(isInteractive())
  const sidebarIsOpen = useSelector(Appearance.sidebarIsOpen)
  const style: CSSProperties = {marginLeft: sidebarIsOpen ? 0 : "inherit"}

  return (
    <BG onMouseDown={touched} onKeyDown={touched} style={style}>
      <AppErrorBoundary>{children}</AppErrorBoundary>
    </BG>
  )
}
