import React, {useLayoutEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import ConnectionError from "src/js/components/ConnectionError"
import Login from "src/js/components/Login"
import MacSpinner from "src/js/components/MacSpinner"
import {activateWorkspace} from "src/js/flows/workspace/activateWorkspace"
import Current from "src/js/state/Current"
import WorkspaceStatuses from "src/js/state/WorkspaceStatuses"
import styled from "styled-components"
import Subroutes from "./subroutes"

const SpinnerWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default function WorkspaceShow() {
  const dispatch = useDispatch()
  const workspace = useSelector(Current.mustGetWorkspace)
  const status = useSelector(WorkspaceStatuses.get(workspace.id))

  useLayoutEffect(() => {
    dispatch(activateWorkspace(workspace.id))
  }, [workspace.id])

  switch (status) {
    case "disconnected":
      return <ConnectionError workspace={workspace} />
    case "login-required":
      return <Login workspace={workspace} />
    case "connected":
      return <Subroutes />
    default:
      return (
        <SpinnerWrap>
          <MacSpinner />
        </SpinnerWrap>
      )
  }
}
