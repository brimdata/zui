import Current from "../state/Current"
import {initSpace} from "./initSpace"
import {Thunk} from "../state/types"
import {activateWorkspace} from "./workspace/activateWorkspace"
import WorkspaceStatuses from "../state/WorkspaceStatuses"

export const initCurrentTab = (): Thunk => async (dispatch, getState) => {
  const state = getState()
  const ws = Current.getWorkspace(state)
  const spaceId = Current.getSpaceId(state)

  try {
    await dispatch(activateWorkspace(ws.id))
    const wsStatus = WorkspaceStatuses.get(ws.id)(getState())
    if (wsStatus === "connected" && spaceId) {
      dispatch(initSpace(spaceId))
    }
  } catch (e) {
    console.error("Workspace connection failed: ", e)
  }
}
