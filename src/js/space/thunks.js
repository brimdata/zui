/* @flow */
import {NoSpacesError} from "../models/Errors"
import type {Thunk} from "../state/types"
import {clearViewer} from "../state/viewer/actions"
import {fetchSpace, fetchSpaces} from "../backend/thunks"
import {getCurrentSpaceTimeWindow} from "../state/reducers/spaces"
import {killAllSearches} from "../searches/cancelSearch"
import {setBackendError} from "../backend"
import {
  setCurrentSpaceName,
  setSpaceInfo,
  setSpaceNames
} from "../state/actions"
import {setOuterTimeWindow} from "../state/span/actions"
import {submitSearchBar} from "../state/thunks/searchBar"
import brim from "../brim"
import modal from "../modal"

export function initSpace(space: string): Thunk {
  return function(dispatch, getState) {
    dispatch(killAllSearches())
    return dispatch(fetchSpaces()).then((spaces) => {
      if (spaces.length === 0) {
        dispatch(setBackendError(new NoSpacesError()))
      } else {
        let name = spaces.includes(space) ? space : spaces[0]
        dispatch(fetchSpace(name)).then((info) => {
          let space = brim.space(info)

          dispatch(setCurrentSpaceName(name))
          dispatch(setSpaceInfo(info))

          if (space.empty()) {
            dispatch(clearViewer())
            dispatch(modal.show("nodata"))
          } else {
            const [_, max] = getCurrentSpaceTimeWindow(getState())
            dispatch(
              setOuterTimeWindow([
                brim
                  .time(max)
                  .subtract(30, "minutes")
                  .toDate(),
                max
              ])
            )
            dispatch(submitSearchBar())
          }
        })
      }
    })
  }
}

export const refreshSpaces = (): Thunk => (dispatch) => {
  return dispatch(fetchSpaces()).then((spaces) =>
    dispatch(setSpaceNames(spaces))
  )
}
