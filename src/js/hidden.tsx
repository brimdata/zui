import "regenerator-runtime/runtime"

import {Provider, useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"
import ReactDOM from "react-dom"

import initialize from "./initializers/initialize"
import lib from "./lib"
import Lakes from "./state/Lakes"
import {differenceWith, map} from "lodash"
import log from "electron-log"
import refreshPoolNames from "./flows/refreshPoolNames"
import workspace from "./brim/workspace"
import {AppDispatch} from "./state/types"
import {subscribeEvents} from "./flows/subscribeEvents"
import refreshPoolInfo from "./flows/refreshPoolInfo"
import {
  getRemotePoolForLake,
  refreshRemoteQueries
} from "./components/LeftPane/remote-queries"
import brim from "./brim"

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
          dispatch(refreshPoolNames(workspace(w)))
        })
        wsSource.addEventListener("pool-update", (_e) => {
          dispatch(refreshPoolNames(workspace(w))).catch((e) =>
            log.error("refresh error: ", e)
          )
        })
        wsSource.addEventListener("pool-delete", (_e) => {
          dispatch(refreshPoolNames(workspace(w)))
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
          dispatch(refreshPoolInfo({workspaceId: w.id, poolId})).catch((e) => {
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
