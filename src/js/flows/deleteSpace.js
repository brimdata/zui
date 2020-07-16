/* @flow */
import type {Thunk} from "../state/types"
import refreshSpaceNames from "./refreshSpaceNames"

const deleteSpace = (name: string): Thunk => (dispatch, getState, {zealot}) => {
  return zealot.spaces.delete(name).then(() => {
    dispatch(refreshSpaceNames())
  })
}

export default deleteSpace
