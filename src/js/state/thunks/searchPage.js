/* @flow */

import type {Thunk} from "redux-thunk"

import {chooseSpace} from "../../space/choose"
import {getAllSpaceNames, getCurrentSpaceName} from "../reducers/spaces"
import {switchSpace} from "../../space/switch"

export const initSearchPage = (): Thunk => (dispatch, getState) => {
  let state = getState()
  let saved = getCurrentSpaceName(state)
  let names = getAllSpaceNames(state)
  return dispatch(switchSpace(chooseSpace(names, saved)))
}
