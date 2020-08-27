/* @flow */
import type {Thunk} from "../state/types"
import refreshSpaceNames from "./refreshSpaceNames"
import {getZealot} from "./getZealot"

const deleteSpace = (name: string): Thunk => (dispatch) => {
  const zealot = dispatch(getZealot())
  return zealot.spaces.delete(name).then(() => {
    dispatch(refreshSpaceNames())
  })
}

export default deleteSpace
