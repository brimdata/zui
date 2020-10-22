import Current from "../state/Current"
import refreshSpaceNames from "./refreshSpaceNames"
import {initSpace} from "./initSpace"
import Clusters from "../state/Clusters"
import {Thunk} from "../state/types"

export const initCurrentTab = (): Thunk => async (dispatch, getState) => {
  const state = getState()
  const conn = Current.getConnection(state)
  const spaceId = Current.getSpaceId(state)

  try {
    await dispatch(refreshSpaceNames())
    if (spaceId) {
      dispatch(initSpace(spaceId))
    }
    dispatch(Clusters.setStatus(conn.id, "connected"))
  } catch {
    dispatch(Clusters.setStatus(conn.id, "disconnected"))
  }
}
