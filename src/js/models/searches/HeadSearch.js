/* @flow */

import type {Dispatch} from "../../reducers/types"
import BaseSearch from "./BaseSearch"
import logsReceiver from "../../receivers/logsReceiver"

export default class HeadSearch extends BaseSearch {
  getReceivers(dispatch: Dispatch) {
    return [logsReceiver(dispatch)]
  }
}
