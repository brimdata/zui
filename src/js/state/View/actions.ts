import {DOWNLOADS_HIDE, DOWNLOADS_SHOW} from "./types"

export default {
  showDownloads: (): DOWNLOADS_SHOW => ({
    type: "DOWNLOADS_SHOW"
  }),

  hideDownloads: (): DOWNLOADS_HIDE => ({
    type: "DOWNLOADS_HIDE"
  })
}
