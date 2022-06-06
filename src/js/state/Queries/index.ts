import actions from "./actions"
import reducer from "./reducer"
import * as flows from "./flows"
import * as selectors from "./selectors"

export default {
  ...actions,
  ...selectors,
  ...flows,
  reducer,
}
