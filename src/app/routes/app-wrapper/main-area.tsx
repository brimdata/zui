import React from "react"
import {useDispatch} from "src/app/core/state"
import AppErrorBoundary from "src/js/components/AppErrorBoundary"
import Tabs from "src/js/state/Tabs"
import styled from "styled-components"

const BG = styled.main`
  min-height: 0;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  grid-area: main;
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

  return (
    <BG onMouseDown={touched} onKeyDown={touched}>
      <div id="modal-dialog-root" />
      <AppErrorBoundary>{children}</AppErrorBoundary>
    </BG>
  )
}
