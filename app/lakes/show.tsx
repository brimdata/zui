import {syncPool} from "app/core/pools/sync-pool"
import usePoolId from "app/router/hooks/use-pool-id"
import useLakeId from "app/router/hooks/use-lake-id"
import {lakeSearch} from "app/router/routes"
import {workspacePath} from "app/router/utils/paths"
import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Redirect, Route, Switch, useRouteMatch} from "react-router"
import Current from "src/js/state/Current"
import {AppDispatch} from "src/js/state/types"
import SearchHome from "../search/home"
import TabSearchLoading from "src/js/components/TabSearchLoading"
import Imports from "src/js/state/Imports"

export default function LakeShow() {
  const match = useRouteMatch()
  return (
    <InitPool>
      <Switch>
        <Route path={lakeSearch.path}>
          <SearchHome />
        </Route>
        <Route default>
          <Redirect to={`${match.url}/search`} />
        </Route>
      </Switch>
    </InitPool>
  )
}

function InitPool({children}) {
  const dispatch = useDispatch<AppDispatch>()
  const poolId = usePoolId()
  const lakeId = useLakeId()
  const pool = useSelector(Current.getPool)
  const ingesting = useSelector(Imports.isInProgress(pool.id))

  useEffect(() => {
    if (poolId) dispatch(syncPool(poolId))
  }, [poolId])

  console.log(pool, ingesting)
  if (!pool) {
    return <Redirect to={workspacePath(lakeId)} />
  } else {
    if (ingesting || !pool.hasStats()) {
      return <TabSearchLoading />
    } else {
      return children
    }
  }
}
