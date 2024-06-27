import {actions} from "./reducer"
import * as selectors from "./selectors"
export default {
  ...selectors,
  ...actions,
}
