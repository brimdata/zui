/* @flow */

import type {State} from "../state/types"
import BoomClient from "../services/BoomClient"
import Boomd from "../state/Boomd"

export default (state: ?State) => {
  const boom = new BoomClient({
    searchQueryParams: {format: "zjson"}
  })

  if (state) {
    boom.setOptions(Boomd.getOptions(state))
  }

  return boom
}
