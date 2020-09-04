

/*
  Used to keep track of the "last" value something was.
  For example, what was the last search that was submitted.
*/

import * as actions from "./actions";
import reducer from "./reducer";
import * as selectors from "./selectors";

export default {
  ...actions,
  ...selectors,
  reducer
};