/* @flow */

import type {Thunk} from "../../state/types"
import {fetchSpace, fetchSpaces} from "../../services/boom"
import Spaces from "../../state/Spaces"
import Tab from "../../state/Tab"

export default {
  refreshNames: (): Thunk => (dispatch, getState) => {
    return dispatch(fetchSpaces()).then((spaces) => {
      let id = Tab.clusterId(getState())
      dispatch(Spaces.setNames(id, spaces))
    })
  },

  refreshInfo: (): Thunk => (dispatch, getState) => {
    let name = Tab.spaceName(getState())
    return dispatch(fetchSpace(name)).then((data) => {
      let id = Tab.clusterId(getState())
      dispatch(Spaces.setDetail(id, data))
    })
  }
}
