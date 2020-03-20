/* @flow */
import type {Thunk} from "../state/types"
import Tab from "../state/Tab"
import refreshSpaceNames from "./refreshSpaceNames"
import {globalDispatch} from "../state/GlobalContext"

const deleteSpace = (name: string): Thunk => (dispatch, getState) => {
  let state = getState()
  let zealot = Tab.getZealot(state)

  return zealot.spaces.delete(name).then(() => {
    globalDispatch(refreshSpaceNames())
  })
}

export default deleteSpace
