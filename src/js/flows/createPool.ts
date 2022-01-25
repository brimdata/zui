import {Thunk} from "../state/types"
import Current from "../state/Current"
import refreshPoolNames from "./refreshPoolNames"
import {getZealot} from "./getZealot"
import {lakePath} from "app/router/utils/paths"
import tabHistory from "app/router/tab-history"

type Props = {
  name: string
}

export const createPool = ({name}: Props): Thunk<Promise<void>> => (
  dispatch,
  getState
) => {
  const zealot = dispatch(getZealot())
  const workspaceId = Current.getWorkspaceId(getState())
  return zealot.createPool(name).then((create) => {
    dispatch(refreshPoolNames()).then(() =>
      dispatch(tabHistory.push(lakePath(create.pool.id, workspaceId)))
    )
  })
}
