import Current from "../state/Current"
import {initSpace} from "./initSpace"
import {Thunk} from "../state/types"
import {activateWorkspace} from "./workspace/activateWorkspace"

export const initCurrentTab = (): Thunk => async (dispatch, getState) => {
  const state = getState()
  const ws = Current.getWorkspace(state)
  const spaceId = Current.getSpaceId(state)

  console.log("initCurrentTab just re-rendered")
  try {
    await dispatch(activateWorkspace(ws.id))
    if (spaceId) {
      dispatch(initSpace(spaceId))
    }
  } catch (e) {
    console.error("Workspace connection failed: ", e)
  }
}
