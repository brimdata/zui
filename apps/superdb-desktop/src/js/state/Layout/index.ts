import {reducer, actions} from "./reducer"
import selectors from "./selectors"

export default {
  ...actions,
  ...selectors,
  reducer,
}
