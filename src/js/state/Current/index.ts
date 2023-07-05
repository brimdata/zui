import * as selectors from "./selectors"
import {actions, reducer} from "./reducer"

export default {
  ...selectors,
  ...actions,
  reducer,
}
