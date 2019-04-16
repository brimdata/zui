/* @flow */
import type {Thunk} from "../state/reducers/types"
import {fetchSpaces} from "../backend/fetch"
import {setSpaceNames} from "../state/actions/spaces"

export const refreshSpaces = (): Thunk => (dispatch) => {
  return dispatch(fetchSpaces()).then((spaces) =>
    dispatch(setSpaceNames(spaces))
  )
}
