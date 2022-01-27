import {getZealot} from "src/js/flows/getZealot"
import Current from "src/js/state/Current"
import {Thunk} from "src/js/state/types"
import {Pool} from "./pool"
import {syncPool} from "./sync-pool"

type Props = {
  name: string
}

export const createPool = ({name}: Props): Thunk<Promise<string>> => (
  dispatch,
  getState
) => {
  const zealot = dispatch(getZealot())
  const lakeId = Current.getWorkspaceId(getState())
  return zealot.createPool(name).then((create) => {
    return dispatch(syncPool(create.pool.id, lakeId)).then(() => create.pool.id)
  })
}
