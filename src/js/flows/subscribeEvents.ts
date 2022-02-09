import {BrimLake} from "../brim"
import {Thunk} from "../state/types"
import {getZealot} from "./getZealot"

export const subscribeEvents = (
  workspace?: BrimLake
): Thunk<Promise<EventSource>> => async (dispatch) => {
  const zealot = await dispatch(getZealot(workspace))
  return zealot.subscribe()
}
