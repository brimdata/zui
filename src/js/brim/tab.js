/* @flow */
import type {TabState} from "../state/tab/types"
import lib from "../lib"

export default function(tab: TabState) {
  return {
    title() {
      return lib
        .compact([tab.search.space || "No Space", tab.searchBar.previous])
        .join(": ")
    }
  }
}
