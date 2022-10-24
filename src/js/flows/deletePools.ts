import {syncPoolsData} from "src/app/core/pools/sync-pools-data"
import Notice from "../state/Notice"
import {Thunk} from "../state/types"
import {deleteOnePool} from "./deletePool"

const deletePools =
  (ids: string[]): Thunk<Promise<void[] | void>> =>
  async (dispatch) => {
    for (let id of ids) {
      try {
        await dispatch(deleteOnePool(id))
      } catch (e) {
        dispatch(
          Notice.set({
            type: "PoolDeleteError",
            message: "Error Deleting Pools",
            details: e.message,
          })
        )
      }
    }
    await dispatch(syncPoolsData())
  }

export default deletePools
