/* @flow */

import buildSearchActions from "./searchActions"
import buildDetailActions from "./detailActions"
import buildSpaceActions from "./spaceActions"

export default {
  search: buildSearchActions,
  detail: buildDetailActions,
  space: buildSpaceActions
}
