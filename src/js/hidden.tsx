import React from "react"
import {syncPool} from "app/core/pools/sync-pool"
import syncPools from "app/core/pools/sync-pools"
import log from "electron-log"
import {differenceWith, map} from "lodash"
import {useEffect} from "react"
import ReactDOM from "react-dom"
import {Provider, useDispatch, useSelector} from "react-redux"
import "regenerator-runtime/runtime"
import brim from "./brim"
import workspace from "./brim/workspace"
import {
  getRemotePoolForLake,
  refreshRemoteQueries
} from "./components/LeftPane/remote-queries"
import {subscribeEvents} from "./flows/subscribeEvents"
import initialize from "./initializers/initialize"
import lib from "./lib"
import Lakes from "./state/Lakes"
import {AppDispatch} from "./state/types"

initialize()
  .then(({store}) => {
    ReactDOM.render(
      <Provider store={store}>
        <Hidden />
      </Provider>,
      lib.doc.id("app-root")
    )
  })
  .catch((e) => {
    // window is hidden, so log errors with main process
    log.error(e)
  })

type workspaceSourceMapType = {
  [workspaceId: string]: EventSource
}

const workspaceSourceMap: workspaceSourceMapType = {}

const Hidden = () => {
  const workspaces = useSelector(Lakes.all)
  const dispatch = useDispatch() as AppDispatch

  useEffect(() => {
    workspaces.forEach((w) => {
      if (w.id in workspaceSourceMap) return
      try {
        const wsSource = dispatch(subscribeEvents(workspace(w)))
        workspaceSourceMap[w.id] = wsSource

        wsSource.addEventListener("pool-new", (_e) => {
          dispatch(syncPools(w.id))
        })
        wsSource.addEventListener("pool-update", (_e) => {
          dispatch(syncPools(w.id)).catch((e) =>
            log.error("refresh error: ", e)
          )
        })
        wsSource.addEventListener("pool-delete", (_e) => {
          dispatch(syncPools(w.id))
        })
        wsSource.addEventListener("branch-commit", (e) => {
          let eventData
          try {
            eventData = JSON.parse(e["data"])
          } catch (e) {
            return log.error(
              new Error("Cannot parse branch-commit event data: " + e)
            )
          }
          const poolId = eventData && eventData["pool_id"]
          if (!poolId)
            return log.error(new Error("No 'pool_id' from branch-commit event"))

          const remotePool = dispatch(getRemotePoolForLake(w.id))
          if (poolId === remotePool?.id)
            dispatch(refreshRemoteQueries(brim.workspace(w)))
          dispatch(syncPool(poolId, w.id)).catch((e) => {
            log.error("branch-commit update failed: ", e)
          })
        })
      } catch (e) {
        log.error("error establishing event subscription: ", e)
      }
    })

    // finally, close event sources for workspaces that are no longer present
    differenceWith(
      map(workspaces, (w) => w.id),
      Object.keys(workspaceSourceMap)
    ).forEach((wsId) => {
      workspaceSourceMap[wsId]?.close()
      delete workspaceSourceMap[wsId]
    })
  }, [workspaces])

  // this component is non-visual, only used for the reactive effects above
  return null
}
