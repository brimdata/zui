/* @flow */
import type {Thunk} from "../state/types"
import {fetchSpace} from "../services/boom"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"

export default function refreshSpaceInfo(): Thunk {
  return () => (dispatch, getState) => {
    let name = Tab.spaceName(getState())
    return dispatch(fetchSpace(name)).then((data) => {
      let id = Tab.clusterId(getState())
      dispatch(Spaces.setDetail(id, data))
    })
  }
}
