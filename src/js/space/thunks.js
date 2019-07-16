/* @flow */
import type {Thunk} from "../state/types"
import {fetchSpace, fetchSpaces} from "../backend/thunks"
import {setClusterMessage} from "../state/clusters/actions"
import {setCurrentSpaceName, setSpaceInfo} from "../state/actions"

export function initSpace(space: string): Thunk {
  return function(dispatch) {
    dispatch(fetchSpaces()).then((spaces) => {
      if (spaces.length === 0) {
        dispatch(setClusterMessage("No spaces in this cluster."))
      } else {
        if (spaces.includes(space)) {
          dispatch(fetchSpace(space)).then((info) => {
            dispatch(setSpaceInfo(info))
          })
        } else {
          dispatch(setCurrentSpaceName(spaces[0]))
        }
      }
    })
  }
}
