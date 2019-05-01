/* @flow */

import type {Thunk} from "redux-thunk"

import {chooseSpace} from "../../space/choose"
import {fetchSpaces, toPromise} from "../../backend/fetch"
import {getCredentials} from "../reducers/boomd"
import {getCurrentSpaceName} from "../reducers/spaces"
import {setSpaceNames} from "../actions"
import {switchSpace} from "../../space/switch"

export const initSearchPage = (): Thunk => (dispatch, getState) => {
  let state = getState()
  let {host, port} = getCredentials(state)
  if (!host || !port) return Promise.reject("Unauthorized")

  return toPromise(dispatch(fetchSpaces())).then((names) => {
    dispatch(setSpaceNames(names))

    if (names.length == 0) {
      return Promise.reject("NoSpaces")
    } else {
      let saved = getCurrentSpaceName(state)
      return dispatch(switchSpace(chooseSpace(names, saved)))
    }
  })
}
