/* @flow */

import type {State} from "../state/reducers/types"
import {getBoomOptions} from "../state/selectors/boom"
import BoomClient from "../BoomClient"

export default (state: ?State) => {
  const boom = new BoomClient()

  if (state) {
    boom.setOptions(getBoomOptions(state))
  }

  return boom
}
