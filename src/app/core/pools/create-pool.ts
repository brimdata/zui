import Current from "src/js/state/Current"
import {Thunk} from "src/js/state/types"
import {syncPool} from "./sync-pool"

type Props = {
  name: string
}

export const createPool =
  ({name}: Props): Thunk<Promise<string>> =>
  async (dispatch, getState, {api}) => {
    const zealot = await api.getZealot()
    const lakeId = Current.getLakeId(getState())
    return zealot.createPool(name).then((res) => {
      return dispatch(syncPool(res.pool.id, lakeId)).then(() => res.pool.id)
    })
  }
