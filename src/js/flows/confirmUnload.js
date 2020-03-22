/* @flow */
import {isEmpty} from "lodash"

import type {Thunk} from "../state/types"
import Handlers from "../state/Handlers"
import showIngestWarning from "./showIngestWarning"

export default (): Thunk => (dispatch, getState) => {
  let spaces = Handlers.getIngestSpaceNames(getState())

  if (isEmpty(spaces)) {
    return Promise.resolve()
  } else {
    return showIngestWarning(spaces)
  }
}
