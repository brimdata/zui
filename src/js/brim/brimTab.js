/* @flow */

import {get} from "lodash"

import type {SpacesState} from "../state/Spaces/types"
import type {TabState} from "../state/Tab/types"
import lib from "../lib"

export default function(tab: TabState, spaces: SpacesState) {
  return {
    title() {
      const name = get(
        spaces,
        [tab.search.clusterId, tab.search.spaceId, "name"],
        "New Tab"
      )
      return lib.compact([name, tab.searchBar.previous]).join(": ")
    }
  }
}
