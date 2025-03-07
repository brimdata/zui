import {differenceWith, map} from "lodash"
import React, {useEffect} from "react"
import {useSelector} from "react-redux"
import {syncPool} from "src/models/sync-pool"
import {syncPoolsData} from "src/models/sync-pools-data"
import {useDispatch} from "src/core/use-dispatch"
import {subscribeEvents} from "src/js/flows/subscribeEvents"
import {Lake} from "src/models/lake"
import Lakes from "src/js/state/Lakes"

type LakeSourceMap = {[lakeId: string]: EventSource}
const lakeSourceMap: LakeSourceMap = {}

export function SubscribeToEvents() {
  const lakes = useSelector(Lakes.all)
  const dispatch = useDispatch()

  useEffect(() => {
    lakes.forEach((l) => {
      if (l.id in lakeSourceMap) return
      try {
        dispatch(subscribeEvents(new Lake(l))).then((lSource) => {
          lakeSourceMap[l.id] = lSource

          lSource.addEventListener("pool-new", (_e) => {
            console.log("pool-new event", l)
            dispatch(syncPoolsData(l.id))
          })
          lSource.addEventListener("pool-update", (_e) => {
            dispatch(syncPoolsData(l.id)).catch((e) =>
              console.error("refresh error: ", e)
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
              return console.error(
                new Error("Cannot parse branch-commit event data: " + e)
              )
            }
            const poolId = eventData && eventData["pool_id"]
            if (!poolId)
              return console.error(
                new Error("No 'pool_id' from branch-commit event")
              )

            dispatch(syncPool(poolId, l.id)).catch((e) => {
              console.error("branch-commit update failed: ", e)
            })
          })
        })
      } catch (e) {
        console.error("error establishing event subscription: ", e)
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

  return <h1>Background Page</h1>
}
