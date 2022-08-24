import {Thunk} from "../state/types"
import Handlers from "../state/Handlers"
import Current from "../state/Current"
import {lakePath} from "src/app/router/utils/paths"
import tabHistory from "src/app/router/tab-history"
import log from "electron-log"

export default (): Thunk<Promise<any[]>> =>
  async (dispatch, getState, {api}) => {
    const current = Current.getLake(getState())
    if (!current) return

    const zealot = await api.getZealot()
    const poolIds = Handlers.getIngestPoolIds(getState())

    // if current pool id is among ingesting pools, clear it
    const currentPoolId = Current.getPoolId(getState())
    if (poolIds.includes(currentPoolId))
      dispatch(tabHistory.replace(lakePath(current.id)))

    return Promise.all(
      poolIds.map((id) => {
        return zealot.deletePool(id).catch((e) => {
          log.error(
            `Unable to delete pool: ${id}, reason: ${JSON.stringify(e)}`
          )
        })
      })
    )
  }
