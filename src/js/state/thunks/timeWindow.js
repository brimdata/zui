/* @flow */

import Search from "../search"
import Tab from "../tab"

export const initTimeWindow = () => (
  dispatch: Function,
  getState: Function
) => {
  let {min_time, max_time} = Tab.space(getState())
  let span = [min_time, max_time]
  dispatch(Search.setSpanArgs(span))
}
