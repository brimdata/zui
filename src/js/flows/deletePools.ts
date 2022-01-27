import syncPools from "app/core/pools/sync-pools"
import Notice from "../state/Notice"
import {Thunk} from "../state/types"
import deletePool from "./deletePool"

const deletePools = (ids: string[]): Thunk<Promise<void[] | void>> => (
  dispatch
) => {
  return Promise.all(ids.map((id) => dispatch(deletePool(id))))
    .catch((e) => {
      dispatch(
        Notice.set({
          type: "PoolDeleteError",
          message: "Error Deleting Pools",
          details: e.message
        })
      )
    })
    .finally(() => dispatch(syncPools()))
}

export default deletePools
