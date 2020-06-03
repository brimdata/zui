/* @flow */

import type {
  DOWNLOADS_HIDE,
  DOWNLOADS_SHOW,
  INVESTIGATION_VIEW_SET,
  InvestigationView,
  TIME_ZONE_SET
} from "./types"

export default {
  setTimeZone: (timeZone: string): TIME_ZONE_SET => ({
    type: "TIME_ZONE_SET",
    timeZone
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
  })
}
