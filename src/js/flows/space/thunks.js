/* @flow */

import type {Thunk} from "../../state/types"
import {fetchSpaces} from "../../services/boom"
import Spaces from "../../state/spaces"
import Tab from "../../state/tab"

export const refreshSpaces = (): Thunk => (dispatch, getState) => {
  return dispatch(fetchSpaces()).then((spaces) => {
    let id = Tab.clusterId(getState())
    dispatch(Spaces.setNames(id, spaces))
  })
}
