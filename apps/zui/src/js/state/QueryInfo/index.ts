import {reducer, actions} from "./reducer"
import * as selectors from "./selectors"

export default {
  reducer,
  ...actions,
  ...selectors,
}
