/* @flow */
import * as spaces from "./spaces"
import {getCurrentSpaceName} from "../reducers/spaces"
import * as timeWindow from "./timeWindow"
import * as searchBar from "./searchBar"
import {getCurrentSpaceTimeWindow} from "../reducers/spaces"
import type {Thunk} from "redux-thunk"

export const init = (): Thunk => (dispatch, getState, api) =>
  new Promise<string>((resolve, reject) => {
    api
      .spaces()
      .done(names => {
        dispatch(spaces.setSpaceNames(names))
        const name = chooseSpaceName(names, getState())
        if (name) {
          dispatch(switchSpace(name))
            .done(resolve)
            .error(reject)
        } else {
          reject("NoSpaces")
        }
      })
      .error(reject)
  })

export const switchSpace = (name: string): Thunk => {
  return (dispatch, getState, api) => {
    return api.space({name}).done(info => {
      dispatch(spaces.setSpaceInfo(info))
      dispatch(spaces.setCurrentSpaceName(info.name))
      dispatch(
        timeWindow.setOuterTimeWindow(getCurrentSpaceTimeWindow(getState()))
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
