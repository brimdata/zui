import Current from "../state/Current"
import {initSpace} from "./initSpace"
import Clusters from "../state/Clusters"
import {Thunk} from "../state/types"
import {initConnection} from "./initConnection"

export const initCurrentTab = (): Thunk => async (
  dispatch,
  getState,
  {globalDispatch}
) => {
  const state = getState()
  const conn = Current.getConnection(state)
  const spaceId = Current.getSpaceId(state)

  try {
    await dispatch(initConnection(conn))
    if (spaceId) {
      dispatch(initSpace(spaceId))
    }
    globalDispatch(Clusters.setStatus(conn.id, "connected"))
  } catch (e) {
    console.error("Connection failed: ", e)
    globalDispatch(Clusters.setStatus(conn.id, "disconnected"))
  }
}
