import {Thunk} from "../state/types"
import refreshPoolNames from "./refreshPoolNames"
import deletePool from "./deletePool"
import Notice from "../state/Notice"

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
    .finally(() => dispatch(refreshPoolNames()))
}

export default deletePools
