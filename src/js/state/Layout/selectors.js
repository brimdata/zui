/* @flow */

import activeTabSelect from "../Tab/activeTabSelect"
import type {TabState} from "../Tab/types"
import {createSelector} from "reselect"
import type {State} from "../types"
import type {ViewerState} from "../Viewer/types"

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

  getHistoryIsOpen: activeTabSelect(
    (state: TabState) => state.layout.historyIsOpen
  ),

  getSpacesIsOpen: activeTabSelect(
    (state: TabState) => state.layout.spacesIsOpen
  ),

  getHistoryHeight: activeTabSelect(
    (state: TabState) => state.layout.historyHeight
  ),

  getSpacesHeight: activeTabSelect(
    (state: TabState) => state.layout.spacesHeight
  ),

  getLeftSidebarIsOpen: activeTabSelect(
    (state: TabState) => state.layout.leftSidebarIsOpen
  ),

  getInvestigationView: activeTabSelect(
    (state: TabState) => state.layout.investigationView
  ),

  getColumnHeadersView: activeTabSelect(
    (state: TabState) => state.layout.columnHeadersView
  )
}
