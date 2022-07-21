import {actions, reducer} from "./reducer"
import * as flows from "./flows"
import * as selectors from "./selectors"

export default {
  reducer,
  ...flows,
  ...actions,
  ...selectors,
}
