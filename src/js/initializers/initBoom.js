/* @flow */

import {BoomClient} from "boom-js-client"

import type {State} from "../reducers/types"
import {getBoomOptions} from "../selectors/boom"

export default (state: ?State) => {
  const boom = new BoomClient()

  if (state) {
    boom.setOptions(getBoomOptions(state))
  }

  return boom
}
