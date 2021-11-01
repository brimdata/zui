import useLakeId from "app/router/hooks/use-lake-id"
import useWorkspaceId from "app/router/hooks/use-workspace-id"
import {lakeSearch} from "app/router/routes"
import {workspacePath} from "app/router/utils/paths"
import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Redirect, Route, Switch, useRouteMatch} from "react-router"
import {initPool} from "src/js/flows/initPool"
import Current from "src/js/state/Current"
import {AppDispatch} from "src/js/state/types"
import SearchHome from "../search/home"

export default function LakeShow() {
  const match = useRouteMatch()
  return (
    <InitLake>
      <Switch>
        <Route path={lakeSearch.path}>
          <SearchHome />
        </Route>
        <Route default>
          <Redirect to={`${match.url}/search`} />
        </Route>
      </Switch>
    </InitLake>
  )
}

function InitLake({children}) {
  const dispatch = useDispatch<AppDispatch>()
  const poolId = useLakeId()
  const workspaceId = useWorkspaceId()
  const pool = useSelector(Current.getPool)

  useEffect(() => {
    if (poolId) dispatch(initPool(poolId))
  }, [poolId])

  if (!pool) return <Redirect to={workspacePath(workspaceId)} />
  if (pool && !pool.hasStats()) return null
  return children
}
