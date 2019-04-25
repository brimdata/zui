/* @flow */

import type {Thunk} from "../state/types"
import {fetchSpaces} from "../backend/fetch"
import {setSpaceNames} from "../state/actions"

export const refreshSpaces = (): Thunk => (dispatch) => {
  return dispatch(fetchSpaces()).then((spaces) =>
    dispatch(setSpaceNames(spaces))
  )
}
