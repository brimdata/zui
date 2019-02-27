/* @flow */
import type {Thunk} from "redux-thunk"

import {
  getCurrentSpaceName,
  getCurrentSpaceTimeWindow
} from "../reducers/spaces"
import {subtract} from "../lib/Time"
import * as searchBar from "./searchBar"
import * as spaces from "./spaces"
import * as timeWindow from "./timeWindow"

export const init = (): Thunk => (dispatch, getState, boom) =>
  new Promise<string>((resolve, reject) => {
    boom.spaces
      .list()
      .then(names => {
        dispatch(spaces.setSpaceNames(names))
        const name = chooseSpaceName(names, getState())
        if (name) {
          return dispatch(switchSpace(name))
            .then(resolve)
            .catch(reject)
        } else {
          reject("NoSpaces")
        }
      })
      .catch(e => {
        reject(e)
      })
  })

export const switchSpace = (name: string): Thunk => {
  return (dispatch, getState, boom) => {
    return boom.spaces.get(name).then(info => {
      dispatch(spaces.setSpaceInfo(info))
      dispatch(spaces.setCurrentSpaceName(info.name))
      const [_min, max] = getCurrentSpaceTimeWindow(getState())
      dispatch(
        timeWindow.setOuterTimeWindow([subtract(max, 30, "minutes"), max])
      )
      dispatch(searchBar.submitSearchBar())
    })
  }
}

const chooseSpaceName = (names, state) => {
  const DEFAULT = "default"
  const current = getCurrentSpaceName(state)

  if (names.includes(current)) return current
  if (names.includes(DEFAULT)) return DEFAULT
  if (names.length > 0) return names[0]
}
