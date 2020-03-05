/* @flow */

import type {State} from "../types"
import ErrorFactory from "../../models/ErrorFactory"

export default {
  getError: (state: State) =>
    state.notice.error && ErrorFactory.create(state.notice.error),
  getVisible: (state: State) => state.notice.visible
}
