/* @flow */

import {getCurrentSpaceTimeWindow} from "../reducers/spaces"
import search from "../search"

export const initTimeWindow = () => (
  dispatch: Function,
  getState: Function
) => {
  const span = getCurrentSpaceTimeWindow(getState())
  dispatch(search.setSpanArgs(span))
}
