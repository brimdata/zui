import {syncPoolsData} from "src/app/core/pools/sync-pools-data"
import Notice from "../state/Notice"
import {Thunk} from "../state/types"
import {deleteOnePool} from "./deletePool"

const deletePools =
  (ids: string[]): Thunk<Promise<void[] | void>> =>
  (dispatch) => {
    return Promise.all(ids.map((id) => dispatch(deleteOnePool(id))))
      .catch((e) => {
        dispatch(
          Notice.set({
            type: "PoolDeleteError",
            message: "Error Deleting Pools",
            details: e.message,
          })
        )
      })
      .finally(() => dispatch(syncPoolsData()))
  }

export default deletePools
