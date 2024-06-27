import {reducer, actions} from "./reducer"
import * as flows from "./flows"
import * as selectors from "./selectors"

export default {
  reducer,
  ...flows,
  ...actions,
  ...selectors,
}
