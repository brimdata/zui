/* @flow */
import type {Thunk} from "../state/reducers/types"
import {fetchSpace} from "../backend/fetch"
import {getCurrentSpaceTimeWindow} from "../state/reducers/spaces"
import {killBoomSearches} from "../state/thunks/boomSearches"
import {
  setCurrentSpaceName,
  setOuterTimeWindow,
  setSpaceInfo
} from "../state/actions"
import {submitSearchBar} from "../state/thunks/searchBar"
import {subtract} from "../lib/Time"

export const switchSpace = (name: string): Thunk => {
  return (dispatch, getState) => {
    dispatch(killBoomSearches())

    return dispatch(fetchSpace(name)).then((info) => {
      dispatch(setSpaceInfo(info))
      dispatch(setCurrentSpaceName(name))

      const [_, max] = getCurrentSpaceTimeWindow(getState())

      dispatch(setOuterTimeWindow([subtract(max, 30, "minutes"), max]))
      dispatch(submitSearchBar())
    })
  }
}
