/* @flow */

export type InvestigationView = "tree" | "linear"
export type ViewState = {
  downloadsIsOpen: boolean,
  timeZone: string,
  investigationView: InvestigationView
}

export type ViewAction =
  | TIME_ZONE_SET
  | DOWNLOADS_SHOW
  | DOWNLOADS_HIDE
  | INVESTIGATION_VIEW_SET

export type TIME_ZONE_SET = {
  type: "TIME_ZONE_SET",
  timeZone: string
}

export type DOWNLOADS_SHOW = {
  type: "DOWNLOADS_SHOW"
}

export type DOWNLOADS_HIDE = {
  type: "DOWNLOADS_HIDE"
}

export type INVESTIGATION_VIEW_SET = {
  type: "INVESTIGATION_VIEW_SET",
  view: InvestigationView
}
