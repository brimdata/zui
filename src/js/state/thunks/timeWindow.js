/* @flow */

import {getCurrentSpaceTimeWindow} from "../reducers/spaces"
import {setOuterTimeWindow} from "../actions"

export const init = () => (dispatch: Function, getState: Function) => {
  const timeWindow = getCurrentSpaceTimeWindow(getState())
  dispatch(setOuterTimeWindow(timeWindow))
}
