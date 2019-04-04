/* @flow */

import type {Thunk} from "redux-thunk"

import {chooseSpace} from "../space/choose"
import {fetchSpaces} from "../backend/fetch"
import {getCurrentSpaceName} from "../reducers/spaces"
import {setSpaceNames} from "./spaces"
import {switchSpace} from "../space/switch"

export const init = (): Thunk => (dispatch, getState) => {
  return dispatch(fetchSpaces()).then(names => {
    dispatch(setSpaceNames(names))

    if (names.length == 0) {
      return Promise.reject("NoSpaces")
    } else {
      let saved = getCurrentSpaceName(getState())
      return dispatch(switchSpace(chooseSpace(names, saved)))
    }
  })
}
