

import actions from "./actions";
import flows from "./flows";
import reducer from "./reducer";
import * as selectors from "./selectors";

export default {
  ...actions,
  ...selectors,
  ...flows,
  reducer
};