/* @flow */

import type {DOWNLOADS_HIDE, DOWNLOADS_SHOW, TIME_ZONE_SET} from "./types"

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
  })
}
