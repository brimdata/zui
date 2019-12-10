/* @flow */

import type {State} from "../state/types"
import {getBoomOptions} from "../state/selectors/boom"
import BoomClient from "../services/BoomClient"

export default (state: ?State) => {
  const boom = new BoomClient({
    searchQueryParams: {format: "zjson"}
  })

  if (state) {
    boom.setOptions(getBoomOptions(state))
  }

  return boom
}
