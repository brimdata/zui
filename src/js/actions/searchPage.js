/* @flow */
import * as spaces from "./spaces"
import {getCurrentSpaceName} from "../reducers/spaces"
import * as timeWindow from "./timeWindow"
import * as searchBar from "./searchBar"
import {getCurrentSpaceTimeWindow} from "../reducers/spaces"

export const init = () => (dispatch: Function, getState: Function, api: *) =>
  // $FlowFixMe
  new Promise((resolve, reject) => {
    api.spaces().done(names => {
      let name = chooseSpaceName(names, getState())
      if (name) {
        api.space({name}).done(info => {
          dispatch(spaces.setSpaceInfo(info))
          dispatch(spaces.setCurrentSpaceName(info.name))
          dispatch(
            timeWindow.setOuterTimeWindow(getCurrentSpaceTimeWindow(getState()))
          )
          dispatch(searchBar.submitSearchBar())
          resolve()
        })
      } else {
        reject("NoSpaces")
      }
    })
  })

const chooseSpaceName = (names, state) => {
  const DEFAULT = "default"
  const current = getCurrentSpaceName(state)

  if (names.includes(current)) return current
  if (names.includes(DEFAULT)) return DEFAULT
  if (names.length > 0) return names[0]
}
