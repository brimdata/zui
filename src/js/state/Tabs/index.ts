import * as flows from "./flows"
import * as selectors from "./selectors"
import {actions, reducer} from "./reducer"

export default {
  ...selectors,
  ...flows,
  ...actions,
  reducer,
}
