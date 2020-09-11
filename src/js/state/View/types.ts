export type ViewState = {
  downloadsIsOpen: boolean
  timeZone: string
}

export type ViewAction = TIME_ZONE_SET | DOWNLOADS_SHOW | DOWNLOADS_HIDE

export type TIME_ZONE_SET = {
  type: "TIME_ZONE_SET"
  timeZone: string
}

export type DOWNLOADS_SHOW = {
  type: "DOWNLOADS_SHOW"
}

export type DOWNLOADS_HIDE = {
  type: "DOWNLOADS_HIDE"
}
