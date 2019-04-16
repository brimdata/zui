/* @flow */
import type {Thunk} from "../state/reducers/types"
import {updateBoomOptions} from "./options"

export const inspectSearch = (
  lookytalk: string,
  overrides: Object = {}
): Thunk => (dispatch, _, boom) => {
  dispatch(updateBoomOptions())
  try {
    return boom.inspectSearch(lookytalk, overrides)
  } catch {
    return null
  }
}
