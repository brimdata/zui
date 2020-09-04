

import actions from "./actions";
import reducer from "./reducer";
import selectors from "./selectors";
import touch from "./touch";

export default {
  ...actions,
  ...selectors,
  touch,
  reducer
};