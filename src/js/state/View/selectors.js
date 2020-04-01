/* @flow */

import type {State} from "../types"

export default {
  getLeftSidebarWidth: (state: State) => state.view.leftSidebarWidth,

  getLeftSidebarIsOpen: (state: State) => state.view.leftSidebarIsOpen,

  getDownloadsIsOpen: (state: State) => state.view.downloadsIsOpen,

  getTimeZone: (state: State) => state.view.timeZone,

  getInvestigationView: (state: State) => {
    return state.view.investigationView
  }
}
