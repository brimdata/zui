/* @flow */
import * as spaces from "./spaces"
import * as timeWindow from "./timeWindow"
import * as searchBar from "./searchBar"
import {getCurrentSpaceTimeWindow} from "../reducers/spaces"

export const init = () => (dispatch: Function, getState: Function, api: *) =>
  // $FlowFixMe
  new Promise((resolve, reject) => {
    api.spaces().done(names => {
      let name = null
      if (names.includes("default")) name = "default"
      else if (names.length > 0) name = names[0]

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
