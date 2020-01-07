/* @flow */
import type {TabState} from "../tab/types"

const selectors = {
  isFetching: (state: TabState) => state.viewer.status === "FETCHING"
}

export default {
  ...selectors
}
