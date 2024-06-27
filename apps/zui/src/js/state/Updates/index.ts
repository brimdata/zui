import {slice} from "./reducer"
import * as selectors from "./selectors"

export default {
  reducer: slice.reducer,
  ...slice.actions,
  ...selectors,
}
