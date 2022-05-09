import {syncPool} from "src/app/core/pools/sync-pool"
import usePoolId from "src/app/router/hooks/use-pool-id"
import PoolHome from "src/app/pools/home"
import useLakeId from "src/app/router/hooks/use-lake-id"
import {lakePoolSearch, poolShow} from "src/app/router/routes"
import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Redirect, Route, Switch, useRouteMatch} from "react-router"
import Current from "src/js/state/Current"
import {AppDispatch} from "src/js/state/types"
import SearchHome from "../search/home"
import TabSearchLoading from "src/js/components/TabSearchLoading"
import Ingests from "src/js/state/Ingests"
import {lakePath} from "src/app/router/utils/paths"
import {FeatureFlag} from "../core/feature-flag"

export default function PoolShow() {
  const match = useRouteMatch()
  return (
    <Switch>
      <InitPool>
        <FeatureFlag
          name={"query-flow"}
          on={
            <Route path={poolShow.path}>
              <PoolHome />
            </Route>
          }
          off={
            <Route path={lakePoolSearch.path}>
              <SearchHome />
            </Route>
          }
        />
      </InitPool>
    </Switch>
  )
}

function InitPool({children}) {
  const dispatch = useDispatch<AppDispatch>()
  const poolId = usePoolId()
  const lakeId = useLakeId()
  const pool = useSelector(Current.getPool)
  const ingesting = useSelector(Ingests.isInProgress(pool?.id))

  useEffect(() => {
    if (poolId) dispatch(syncPool(poolId))
  }, [poolId])

  if (!pool) {
    return <Redirect to={lakePath(lakeId)} />
  } else if (ingesting) {
    return <TabSearchLoading />
  } else if (!pool.hasStats()) {
    return null
  } else {
    return children
  }
}
