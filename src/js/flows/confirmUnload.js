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
    let names = spaceIds.map((id) => Spaces.get(clusterId, id)(getState()).name)
    return showIngestWarning(names)
  }
}
