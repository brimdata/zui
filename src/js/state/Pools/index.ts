import {getTimeRange} from "./get-time-range"
import {actions, reducer} from "./reducer"
import * as selectors from "./selectors"

export default {
  ...actions,
  ...selectors,
  reducer,
  getTimeRange,
}
