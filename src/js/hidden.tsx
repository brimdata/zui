import "regenerator-runtime/runtime"

import {Provider, useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"
import ReactDOM from "react-dom"

import initialize from "./initializers/initialize"
import lib from "./lib"
import Workspaces from "./state/Workspaces"
import {differenceWith, map} from "lodash"
import log from "electron-log"
import refreshPoolNames from "./flows/refreshPoolNames"
import workspace from "./brim/workspace"
import {AppDispatch} from "./state/types"
import {subscribeEvents} from "./flows/subscribeEvents"
import get from "lodash/get"
import refreshPoolInfo from "./flows/refreshPoolInfo"

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
  const workspaces = useSelector(Workspaces.all)
  const dispatch = useDispatch() as AppDispatch

  useEffect(() => {
    workspaces.forEach((w) => {
      if (w.id in workspaceSourceMap) return

      const wsSource = dispatch(subscribeEvents(workspace(w)))
      workspaceSourceMap[w.id] = wsSource

      wsSource.addEventListener("pool-new", (_e) => {
        dispatch(refreshPoolNames(workspace(w)))
      })
      wsSource.addEventListener("pool-update", (_e) => {
        dispatch(refreshPoolNames(workspace(w)))
      })
      wsSource.addEventListener("pool-delete", (_e) => {
        dispatch(refreshPoolNames(workspace(w)))
      })
      wsSource.addEventListener("pool-commit", (e) => {
        let eventData
        try {
          eventData = JSON.parse(e["data"])
        } catch (e) {
          return log.error(
            new Error("Cannot parse pool-commit event data: " + e)
          )
        }
        const poolId = eventData && eventData["pool_id"]
        if (!poolId)
          return log.error(new Error("No 'pool_id' from pool-commit event"))

        dispatch(refreshPoolInfo({workspaceId: w.id, poolId}))
      })
    })

    // finally, close event sources for workspaces that are no longer present
    differenceWith(
      map(workspaces, (w) => w.id),
      Object.keys(workspaceSourceMap)
    ).forEach((wsId) => {
      workspaceSourceMap[wsId].close()
      delete workspaceSourceMap[wsId]
    })
  }, [workspaces])

  // this component is non-visual, only used for the reactive effects above
  return null
}
