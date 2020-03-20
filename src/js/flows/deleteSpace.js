/* @flow */
import type {Thunk} from "../state/types"
import Tab from "../state/Tab"
import refreshSpaceNames from "./refreshSpaceNames"

const deleteSpace = (name: string): Thunk => (dispatch, getState) => {
  let state = getState()
  let zealot = Tab.getZealot(state)

  return zealot.spaces.delete(name).then(() => {
    dispatch(refreshSpaceNames())
  })
}

export default deleteSpace
