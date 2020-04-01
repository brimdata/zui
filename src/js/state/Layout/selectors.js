/* @flow */

import activeTabSelect from "../Tab/activeTabSelect"
import type {TabState} from "../Tab/types"

export default {
  getRightSidebarWidth: activeTabSelect(
    (state: TabState) => state.layout.rightSidebarWidth
  ),

  getRightSidebarIsOpen: activeTabSelect(
    (state: TabState) => state.layout.rightSidebarIsOpen
  )
}
