import actions from "./actions"
import reducer from "./reducer"
import selectors from "./selectors"

export default {
  reducer,
  ...actions,
  ...selectors
}
