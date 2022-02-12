import ReleaseNotes from "app/release-notes/release-notes"
import {lakeReleaseNotes, lakeImport, query, poolShow} from "app/router/routes"
import {lakeImportPath} from "app/router/utils/paths"
import React, {useLayoutEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Redirect, Route, Switch, useRouteMatch} from "react-router"
import ConnectionError from "src/js/components/ConnectionError"
import Login from "src/js/components/Login"
import MacSpinner from "src/js/components/MacSpinner"
import {updateStatus} from "src/js/flows/lake/update-status"
import Current from "src/js/state/Current"
import LakeStatuses from "src/js/state/LakeStatuses"
import styled from "styled-components"
import LakeHome from "./home"
import QueryHome from "../query-home"
import PoolShow from "app/pools/show"

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
  if (!lake) return <Redirect to="/lakes" />

  useLayoutEffect(() => {
    dispatch(updateStatus(lake.id))
  }, [lake.id])

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
        <Route path={poolShow.path}>
          <PoolShow />
        </Route>
        <Route path={query.path}>
          <QueryHome />
        </Route>
        <Route default>
          <Redirect to={lakeImportPath(match.params.lakeId)} />
        </Route>
      </Switch>
    </InitLake>
  )
}
