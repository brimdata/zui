import {Thunk} from "../state/types"
import Handlers from "../state/Handlers"
import rpc from "../electron/rpc"
import {getZealot} from "./getZealot"
import Current from "../state/Current"
import {lakePath} from "app/router/utils/paths"
import tabHistory from "app/router/tab-history"

export default (): Thunk<Promise<any[]>> => async (dispatch, getState) => {
  const current = Current.getLake(getState())
  if (!current) return

  const zealot = await dispatch(getZealot())
  const poolIds = Handlers.getIngestPoolIds(getState())

  // if current pool id is among ingesting pools, clear it
  const currentPoolId = Current.getPoolId(getState())
  if (poolIds.includes(currentPoolId))
    dispatch(tabHistory.replace(lakePath(current.id)))

  return Promise.all(
    poolIds.map((id) => {
      return zealot.deletePool(id).catch((e) => {
        rpc.log(`Unable to delete pool: ${id}, reason: ${JSON.stringify(e)}`)
      })
    })
  )
}
