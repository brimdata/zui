import React from "react"
import {syncPool} from "src/app/core/pools/sync-pool"
import {syncPoolsData} from "src/app/core/pools/sync-pools-data"
import log from "electron-log"
import {differenceWith, map} from "lodash"
import {useEffect} from "react"
import ReactDOM from "react-dom"
import {Provider, useDispatch, useSelector} from "react-redux"
import "regenerator-runtime/runtime"
import brim from "./brim"
import lake from "./brim/lake"
import {
  getRemotePoolForLake,
  refreshRemoteQueries
} from "src/app/features/sidebar/flows/remote-queries"
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

type lakeSourceMapType = {
  [lakeId: string]: EventSource
}

const lakeSourceMap: lakeSourceMapType = {}

const Hidden = () => {
  const lakes = useSelector(Lakes.all)
  const dispatch = useDispatch() as AppDispatch

  useEffect(() => {
    lakes.forEach((l) => {
      if (l.id in lakeSourceMap) return
      try {
        dispatch(subscribeEvents(lake(l))).then((lSource) => {
          lakeSourceMap[l.id] = lSource

          lSource.addEventListener("pool-new", (_e) => {
            dispatch(syncPoolsData(l.id))
          })
          lSource.addEventListener("pool-update", (_e) => {
            dispatch(syncPoolsData(l.id)).catch((e) =>
              log.error("refresh error: ", e)
            )
          })
          lSource.addEventListener("pool-delete", (_e) => {
            dispatch(syncPoolsData(l.id))
          })
          lSource.addEventListener("branch-commit", (e) => {
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
              return log.error(
                new Error("No 'pool_id' from branch-commit event")
              )

            const remotePool = dispatch(getRemotePoolForLake(l.id))
            if (poolId === remotePool?.id)
              dispatch(refreshRemoteQueries(brim.lake(l)))
            dispatch(syncPool(poolId, l.id)).catch((e) => {
              log.error("branch-commit update failed: ", e)
            })
          })
        })
      } catch (e) {
        log.error("error establishing event subscription: ", e)
      }
    })

    // finally, close event sources for lakes that are no longer present
    differenceWith(
      map(lakes, (l) => l.id),
      Object.keys(lakeSourceMap)
    ).forEach((lId) => {
      lakeSourceMap[lId]?.close()
      delete lakeSourceMap[lId]
    })
  }, [lakes])

  useEffect(() => {
    global.firstMount = true
  }, [])

  // this component is non-visual, only used for the reactive effects above
  return null
}
