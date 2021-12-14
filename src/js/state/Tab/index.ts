import flows from "./flows"
import {useTabState} from "./local-state"
import reducer from "./reducer"
import selectors from "./selectors"

export default {
  reducer,
  ...selectors,
  ...flows,
  useState: useTabState
}
