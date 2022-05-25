import * as flows from "./flows"
import {actions, reducer} from "./reducer"
import * as selectors from "./selectors"
export default {
  ...actions,
  ...selectors,
  ...flows,
  reducer,
}
