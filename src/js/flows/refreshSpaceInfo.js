/* @flow */
import type {Thunk} from "../state/types"
import {fetchSpace} from "../services/boom"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import {globalDispatch} from "../state/GlobalContext"

export default function refreshSpaceInfo(): Thunk {
  return () => (dispatch, getState) => {
    let name = Tab.getSpaceName(getState())
    return dispatch(fetchSpace(name)).then((data: *) => {
      let id = Tab.clusterId(getState())
      globalDispatch(Spaces.setDetail(id, data))
    })
  }
}
