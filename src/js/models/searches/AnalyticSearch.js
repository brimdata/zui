/* @flow */

import type {Dispatch} from "../../reducers/types"
import BaseSearch from "./BaseSearch"
import analyticsReceiver from "../../receivers/analyticsReceiver"

export default class AnalyticSearch extends BaseSearch {
  getReceivers(dispatch: Dispatch) {
    return [analyticsReceiver(dispatch, 0)]
  }
}
