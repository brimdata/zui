/* @flow */

import activeTabSelect from "../Tab/activeTabSelect"
import type {TabState} from "../Tab/types"

export default {
  getRightSidebarWidth: activeTabSelect(
    (state: TabState) => state.layout.rightSidebarWidth
  ),

  getRightSidebarIsOpen: activeTabSelect(
    (state: TabState) => state.layout.rightSidebarIsOpen
  ),

  getLeftSidebarWidth: activeTabSelect(
    (state: TabState) => state.layout.leftSidebarWidth
  ),

  getLeftSidebarIsOpen: activeTabSelect(
    (state: TabState) => state.layout.leftSidebarIsOpen
  )
}
