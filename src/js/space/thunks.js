/* @flow */
import type {Thunk} from "../state/types"
import {fetchSpace, fetchSpaces} from "../backend/thunks"
import {getCurrentSpaceTimeWindow} from "../state/reducers/spaces"
import {setClusterError} from "../state/clusters/actions"
import {
  setCurrentSpaceName,
  setOuterTimeWindow,
  setSpaceInfo
} from "../state/actions"
import {submitSearchBar} from "../state/thunks/searchBar"
import {subtract} from "../lib/Time"

export function initSpace(space: string): Thunk {
  return function(dispatch, getState) {
    return dispatch(fetchSpaces()).then((spaces) => {
      if (spaces.length === 0) {
        dispatch(setClusterError("No spaces in this cluster."))
      } else {
        let name = spaces.includes(space) ? space : spaces[0]
        dispatch(fetchSpace(name)).then((info) => {
          dispatch(setCurrentSpaceName(name))
          dispatch(setSpaceInfo(info))
          const [_, max] = getCurrentSpaceTimeWindow(getState())
          dispatch(setOuterTimeWindow([subtract(max, 30, "minutes"), max]))
          dispatch(submitSearchBar())
        })
      }
    })
  }
}
