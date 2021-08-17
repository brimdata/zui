export type ViewState = {
  downloadsIsOpen: boolean
}

export type ViewAction = DOWNLOADS_SHOW | DOWNLOADS_HIDE

export type DOWNLOADS_SHOW = {
  type: "DOWNLOADS_SHOW"
}

export type DOWNLOADS_HIDE = {
  type: "DOWNLOADS_HIDE"
}
