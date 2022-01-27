import {actions, reducer} from "./reducer"
import * as selectors from "./selectors"

export default {
  reducer,
  ...selectors,
  ...actions
}
