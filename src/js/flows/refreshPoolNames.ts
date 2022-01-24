import {BrimWorkspace} from "../brim"
import Current from "../state/Current"
import Pools from "../state/Pools"
import {Thunk} from "../state/types"
import {getZealot} from "./getZealot"

/**
 * This only gets the list of names from the server, all the
 * details like the min_time and max_time need to be requested
 * somewhere else. (like in initPool)
 */
export default function refreshPoolNames(
  ws?: BrimWorkspace
): Thunk<Promise<void>> {
  return async (dispatch, getState) => {
    const zealot = dispatch(getZealot(ws))
    return zealot.getPools().then((pools) => {
      const id = ws?.id || Current.getWorkspaceId(getState())
      if (id) dispatch(Pools.setPools(id, pools))
    })
  }
}
