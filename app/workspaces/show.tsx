import LakeHome from "app/lakes/home"
import LakeShow from "app/lakes/show"
import {lakeImport, lakeShow} from "app/router/routes"
import {lakeImportPath} from "app/router/utils/paths"
import React, {useLayoutEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Redirect, Route, Switch, useRouteMatch} from "react-router"
import ConnectionError from "src/js/components/ConnectionError"
import Login from "src/js/components/Login"
import MacSpinner from "src/js/components/MacSpinner"
import {updateStatus} from "src/js/flows/workspace/update-status"
import Current from "src/js/state/Current"
import WorkspaceStatuses from "src/js/state/WorkspaceStatuses"
import styled from "styled-components"

const SpinnerWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

function InitWorkspace({children}) {
  const dispatch = useDispatch()
  const workspace = useSelector(Current.mustGetWorkspace)
  const status = useSelector(WorkspaceStatuses.get(workspace.id))

  useLayoutEffect(() => {
    dispatch(updateStatus(workspace.id))
  }, [workspace.id])

  switch (status) {
    case "disconnected":
      return <ConnectionError workspace={workspace} />
    case "login-required":
      return <Login workspace={workspace} />
    case "connected":
    case "retrying":
      return children
    default:
      return (
        <SpinnerWrap>
          <MacSpinner />
        </SpinnerWrap>
      )
  }
}

export default function WorkspaceShow() {
  const match = useRouteMatch<{workspaceId: string}>()
  return (
    <InitWorkspace>
      <Switch>
        <Route path={lakeImport.path}>
          <LakeHome />
        </Route>
        <Route path={lakeShow.path}>
          <LakeShow />
        </Route>
        <Route default>
          <Redirect to={lakeImportPath(match.params.workspaceId)} />
        </Route>
      </Switch>
    </InitWorkspace>
  )
}
