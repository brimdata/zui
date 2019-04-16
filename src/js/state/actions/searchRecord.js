/* @flow */

import type {SearchRecord} from "../types"

export const recordSearch = (record: SearchRecord) => ({
  type: "SEARCH_HISTORY_PUSH",
  entry: record
})
