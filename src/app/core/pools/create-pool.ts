import {getZealot} from "src/js/flows/getZealot"
import Current from "src/js/state/Current"
import {Thunk} from "src/js/state/types"
import {syncPool} from "./sync-pool"

type Props = {
  name: string
}

export const createPool = ({name}: Props): Thunk<Promise<string>> => async (
  dispatch,
  getState
) => {
  const zealot = await dispatch(getZealot())
  const lakeId = Current.getLakeId(getState())
  return zealot.createPool(name).then((res) => {
    return dispatch(syncPool(res.pool.id, lakeId)).then(() => res.pool.id)
  })
}
