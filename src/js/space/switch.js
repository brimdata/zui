/* @flow */
import type {Thunk} from "../reducers/types"
import {fetchSpace} from "../backend/fetch"
import {getCurrentSpaceTimeWindow} from "../reducers/spaces"
import {killBoomSearches} from "../actions/boomSearches"
import {setCurrentSpaceName, setSpaceInfo} from "../actions/spaces"
import {setOuterTimeWindow} from "../actions/timeWindow"
import {submitSearchBar} from "../actions/searchBar"
import {subtract} from "../lib/Time"

export const switchSpace = (name: string): Thunk => {
  return (dispatch, getState) => {
    dispatch(killBoomSearches())

    return dispatch(fetchSpace(name)).then(info => {
      dispatch(setSpaceInfo(info))
      dispatch(setCurrentSpaceName(name))

      const [_, max] = getCurrentSpaceTimeWindow(getState())

      dispatch(setOuterTimeWindow([subtract(max, 30, "minutes"), max]))
      dispatch(submitSearchBar())
    })
  }
}
