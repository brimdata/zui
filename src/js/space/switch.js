/* @flow */

import type {Thunk} from "../state/types"
import {fetchSpace} from "../backend/fetch"
import {getCurrentSpaceTimeWindow} from "../state/reducers/spaces"
import {killSearchesByTag} from "../searches/cancelSearch"
import {
  setCurrentSpaceName,
  setOuterTimeWindow,
  setSpaceInfo
} from "../state/actions"
import {submitSearchBar} from "../state/thunks/searchBar"
import {subtract} from "../lib/Time"

export const switchSpace = (name: string): Thunk => {
  return (dispatch, getState) => {
    dispatch(killSearchesByTag())
    return dispatch(fetchSpace(name)).then((info) => {
      dispatch(setSpaceInfo(info))
      dispatch(setCurrentSpaceName(name))

      const [_, max] = getCurrentSpaceTimeWindow(getState())

      dispatch(setOuterTimeWindow([subtract(max, 30, "minutes"), max]))
      dispatch(submitSearchBar())
    })
  }
}
