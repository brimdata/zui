/* @flow */
import type {Thunk} from "../state/types"
import refreshSpaceNames from "./refreshSpaceNames"
import {getZealot} from "./getZealot"

const deleteSpace = (id: string): Thunk => (dispatch) => {
  const zealot = dispatch(getZealot())
  return zealot.spaces.delete(id).then(() => {
    dispatch(refreshSpaceNames())
  })
}

export default deleteSpace
