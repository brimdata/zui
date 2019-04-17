/* @flow */

import {getCurrentSpaceTimeWindow} from "../reducers/spaces"
import {setOuterTimeWindow} from "../actions"

export const initTimeWindow = () => (
  dispatch: Function,
  getState: Function
) => {
  const timeWindow = getCurrentSpaceTimeWindow(getState())
  dispatch(setOuterTimeWindow(timeWindow))
}
