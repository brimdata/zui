import * as selectors from "./selectors"
import {actions} from "./reducer"

export default {
  ...selectors,
  ...actions,
}
