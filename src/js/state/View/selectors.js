/* @flow */

import type {State} from "../types"

export default {
  getRightSidebarWidth: (state: State) => state.view.rightSidebarWidth,

  getLeftSidebarWidth: (state: State) => state.view.leftSidebarWidth,

  getLeftSidebarIsOpen: (state: State) => state.view.leftSidebarIsOpen,

  getRightSidebarIsOpen: (state: State) => state.view.rightSidebarIsOpen,

  getDownloadsIsOpen: (state: State) => state.view.downloadsIsOpen,

  getTimeZone: (state: State) => state.view.timeZone,

  getInvestigationView: (state: State) => {
    return state.view.investigationView
  },

  getIsIngesting: (state: State) => state.view.isIngesting
}
