/* @flow */

import * as actions from "./actions"
import reducer from "./reducer"
import * as selectors from "./selectors"

export default {
  ...selectors,
  ...actions,
  reducer
}
