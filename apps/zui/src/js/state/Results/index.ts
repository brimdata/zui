import {actions, reducer} from "./reducer"
import * as selectors from "./selectors"
export default {
  ...actions,
  ...selectors,
  reducer,
}
