/* @flow */

import {getCurrentSpaceTimeWindow} from "../reducers/spaces"
import search from "../search"

export const initTimeWindow = () => (
  dispatch: Function,
  getState: Function
) => {
  const timeWindow = getCurrentSpaceTimeWindow(getState())
  dispatch(search.setSpanArgsFromDates(timeWindow))
}
