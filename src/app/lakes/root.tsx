import ReleaseNotes from "src/app/release-notes/release-notes"
import {
  lakeReleaseNotes,
  lakeImport,
  query,
  poolShow,
  lakeWelcome,
} from "src/app/router/routes"
import {lakeImportPath} from "src/app/router/utils/paths"
import React, {useLayoutEffect} from "react"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import {Redirect, Route, Switch, useRouteMatch} from "react-router"
import ConnectionError from "src/js/components/ConnectionError"
import Login from "src/js/components/Login"
import MacSpinner from "src/js/components/MacSpinner"
import {updateStatus} from "src/js/flows/lake/update-status"
import Current from "src/js/state/Current"
import LakeStatuses from "src/js/state/LakeStatuses"
import styled from "styled-components"
import LakeHome from "./home"
import PoolShow from "src/app/pools/show"
import {QueryRoute} from "../query-home/route"
import {WelcomePage} from "src/pages/welcome"

const SpinnerWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

function InitLake({children}) {
  const dispatch = useDispatch()
  const lake = useSelector(Current.getLake)
  const status = useSelector(LakeStatuses.get(lake?.id))

  useLayoutEffect(() => {
    if (lake) dispatch(updateStatus(lake.id))
  }, [lake?.id])

  if (!lake) return <Redirect to="/lakes" />

  switch (status) {
    case "disconnected":
      return <ConnectionError lake={lake} />
    case "login-required":
      return <Login lake={lake} />
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

export default function LakeRoot() {
  const match = useRouteMatch<{lakeId: string}>()
  return (
    <InitLake>
      <Switch>
        <Route path={lakeImport.path}>
          <LakeHome />
        </Route>
        <Route path={lakeReleaseNotes.path}>
          <ReleaseNotes />
        </Route>
        <Route path={lakeWelcome.path}>
          <WelcomePage />
        </Route>
        <Route path={poolShow.path}>
          <PoolShow />
        </Route>
        <Route path={query.path}>
          <QueryRoute />
        </Route>
        <Route default>
          <Redirect to={lakeImportPath(match.params.lakeId)} />
        </Route>
      </Switch>
    </InitLake>
  )
}
