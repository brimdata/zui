/* @flow */
import {isEmpty} from "lodash"

import type {Thunk} from "../state/types"
import Handlers from "../state/Handlers"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import showIngestWarning from "./showIngestWarning"

export default (): Thunk => (dispatch, getState) => {
  let spaceIds = Handlers.getIngestSpaceIds(getState())

  if (isEmpty(spaceIds)) {
    return Promise.resolve()
  } else {
    let clusterId = Tab.clusterId(getState())
    let names = spaceIds.map((id) => {
      let space = Spaces.get(clusterId, id)(getState())
      if (space) return space.name
      else return id
    })
    return showIngestWarning(names)
  }
}
