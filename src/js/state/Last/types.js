/* @flow */

import type {SearchRecord} from "../../types"

export type LastState = {
  search: ?SearchRecord
}
export type LastAction = LAST_SEARCH_SET

export type LAST_SEARCH_SET = {type: "LAST_SEARCH_SET", search: SearchRecord}
