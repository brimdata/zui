import useLakeId from "app/router/hooks/use-lake-id"
import useWorkspaceId from "app/router/hooks/use-workspace-id"
import {lakeSearch} from "app/router/routes"
import {workspacePath} from "app/router/utils/paths"
import React, {ReactElement, useEffect, useState} from "react"
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

function InitLake({children}: {children: ReactElement}) {
  const dispatch = useDispatch<AppDispatch>()
  const lakeId = useLakeId()
  const workspaceId = useWorkspaceId()
  const [fetching, setFetching] = useState(false)
  const lake = useSelector(Current.getPool)

  useEffect(() => {
    if (lakeId) {
      setFetching(true)
      dispatch(initPool(lakeId)).finally(() => setFetching(false))
    } else {
      setFetching(false)
    }
  }, [lakeId])

  if (fetching) return null
  if (!lake) return <Redirect to={workspacePath(workspaceId)} />
  return children
}
