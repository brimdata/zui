import {BrimWorkspace} from "../brim"
import {Thunk} from "../state/types"
import {getZealot} from "./getZealot"

export const subscribeEvents = (
  workspace?: BrimWorkspace
): Thunk<EventSource> => (dispatch) => {
  const zealot = dispatch(getZealot(workspace))
  return zealot.subscribe()
}
