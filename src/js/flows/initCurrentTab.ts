import Current from "../state/Current"
import {initSpace} from "./initSpace"
import {Thunk} from "../state/types"
import {initConnection} from "./initConnection"

export const initCurrentTab = (): Thunk => async (dispatch, getState) => {
  const state = getState()
  const conn = Current.getConnection(state)
  const spaceId = Current.getSpaceId(state)

  try {
    await dispatch(initConnection(conn.serialize()))
    if (spaceId) {
      dispatch(initSpace(spaceId))
    }
  } catch (e) {
    console.error("Connection failed: ", e)
  }
}
