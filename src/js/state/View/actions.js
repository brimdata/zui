/* @flow */

import type {
  DOWNLOADS_HIDE,
  DOWNLOADS_SHOW,
  INGESTING_SET,
  INVESTIGATION_VIEW_SET,
  InvestigationView,
  LEFT_SIDEBAR_HIDE,
  LEFT_SIDEBAR_SHOW,
  LEFT_SIDEBAR_TOGGLE,
  LEFT_SIDEBAR_WIDTH_SET,
  TIME_ZONE_SET
} from "./types"

export default {
  showLeftSidebar: (): LEFT_SIDEBAR_SHOW => ({
    type: "LEFT_SIDEBAR_SHOW"
  }),

  hideLeftSidebar: (): LEFT_SIDEBAR_HIDE => ({
    type: "LEFT_SIDEBAR_HIDE"
  }),

  toggleLeftSidebar: (): LEFT_SIDEBAR_TOGGLE => ({
    type: "LEFT_SIDEBAR_TOGGLE"
  }),

  setTimeZone: (timeZone: string): TIME_ZONE_SET => ({
    type: "TIME_ZONE_SET",
    timeZone
  }),

  setLeftSidebarWidth: (width: number): LEFT_SIDEBAR_WIDTH_SET => ({
    type: "LEFT_SIDEBAR_WIDTH_SET",
    width
  }),

  showDownloads: (): DOWNLOADS_SHOW => ({
    type: "DOWNLOADS_SHOW"
  }),

  hideDownloads: (): DOWNLOADS_HIDE => ({
    type: "DOWNLOADS_HIDE"
  }),

  setInvestigationView: (view: InvestigationView): INVESTIGATION_VIEW_SET => ({
    type: "INVESTIGATION_VIEW_SET",
    view
  }),

  setIsIngesting: (value: boolean): INGESTING_SET => ({
    type: "INGESTING_SET",
    value
  })
}
