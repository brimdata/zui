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
  height: 100%;
  display: flex;
  flex-direction: column;
  grid-area: main;
  overflow: hidden;
  background: white;
  z-index: 1;
  box-shadow: -1px -1px 2px rgba(0, 0, 0, 0.1);
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
  const style: CSSProperties = {borderTopLeftRadius: sidebarIsOpen ? 6 : 0}

  return (
    <BG onMouseDown={touched} onKeyDown={touched} style={style}>
      <div id="modal-dialog-root" />
      <AppErrorBoundary>{children}</AppErrorBoundary>
    </BG>
  )
}
