import * as flows from "./flows"
import * as selectors from "./selectors"
import slice from "./slice"

export default {
  ...selectors,
  ...flows,
  ...slice.actions,
  reducer: slice.reducer,
}
