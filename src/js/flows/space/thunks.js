/* @flow */

import type {Thunk} from "../../state/types"
import {fetchSpaces} from "../../services/boom"
import Spaces from "../../state/Spaces"
import Tab from "../../state/Tab"

export const refreshSpaces = (): Thunk => (dispatch, getState) => {
  return dispatch(fetchSpaces()).then((spaces) => {
    let id = Tab.clusterId(getState())
    dispatch(Spaces.setNames(id, spaces))
  })
}
