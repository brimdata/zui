/* @flow */

import type {TabState} from "../Tab/types"

const selectors = {
  isFetching: (state: TabState) => state.viewer.status === "FETCHING"
}

export default {
  ...selectors
}
