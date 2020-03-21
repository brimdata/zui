/* @flow */
import {isEmpty} from "lodash"

import {remote} from "electron"

import type {Thunk} from "../state/types"
import {shutdown} from "./shutdown"
import Handlers from "../state/Handlers"

export default (): Thunk => (dispatch, getState) => {
  let spaces = Handlers.getIngestSpaceNames(getState())

  if (isEmpty(spaces)) {
    dispatch(shutdown())
  } else {
    showCloseDialog(spaces).then((resp) => {
      if (resp === 0) dispatch(shutdown())
    })
  }
}

function showCloseDialog(spaces) {
  return remote.dialog
    .showMessageBox({
      type: "warning",
      title: "Confirm Close Window",
      message: "Are you sure you want to close while ingesting?",
      detail: `This will delete the partial generated data for: ${spaces.join(
        ", "
      )}`,
      buttons: ["OK", "Cancel"]
    })
    .then(({response}) => response)
}
