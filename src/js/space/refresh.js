/* @flow */
import type {Thunk} from "../reducers/types"
import {fetchSpaces} from "../backend/fetch"
import {setSpaceNames} from "../actions/spaces"

export const refreshSpaces = (): Thunk => dispatch => {
  return dispatch(fetchSpaces()).then(spaces => dispatch(setSpaceNames(spaces)))
}
