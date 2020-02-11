/* @flow */

export type InvestigationView = "tree" | "linear"
export type ViewState = {
  leftSidebarIsOpen: boolean,
  rightSidebarIsOpen: boolean,
  downloadsIsOpen: boolean,
  leftSidebarWidth: number,
  rightSidebarWidth: number,
  timeZone: string,
  investigationView: InvestigationView,
  isIngesting: boolean
}

export type ViewAction =
  | RIGHT_SIDEBAR_SHOW
  | RIGHT_SIDEBAR_HIDE
  | LEFT_SIDEBAR_SHOW
  | LEFT_SIDEBAR_HIDE
  | RIGHT_SIDEBAR_TOGGLE
  | LEFT_SIDEBAR_TOGGLE
  | TIME_ZONE_SET
  | RIGHT_SIDEBAR_WIDTH_SET
  | LEFT_SIDEBAR_WIDTH_SET
  | DOWNLOADS_SHOW
  | DOWNLOADS_HIDE
  | INVESTIGATION_VIEW_SET
  | INGESTING_SET

export type INGESTING_SET = {
  type: "INGESTING_SET",
  value: boolean
}

export type RIGHT_SIDEBAR_SHOW = {
  type: "RIGHT_SIDEBAR_SHOW"
}

export type RIGHT_SIDEBAR_HIDE = {
  type: "RIGHT_SIDEBAR_HIDE"
}

export type LEFT_SIDEBAR_SHOW = {
  type: "LEFT_SIDEBAR_SHOW"
}

export type LEFT_SIDEBAR_HIDE = {
  type: "LEFT_SIDEBAR_HIDE"
}

export type RIGHT_SIDEBAR_TOGGLE = {
  type: "RIGHT_SIDEBAR_TOGGLE"
}

export type LEFT_SIDEBAR_TOGGLE = {
  type: "LEFT_SIDEBAR_TOGGLE"
}

export type TIME_ZONE_SET = {
  type: "TIME_ZONE_SET",
  timeZone: string
}

export type RIGHT_SIDEBAR_WIDTH_SET = {
  type: "RIGHT_SIDEBAR_WIDTH_SET",
  width: number
}

export type LEFT_SIDEBAR_WIDTH_SET = {
  type: "LEFT_SIDEBAR_WIDTH_SET",
  width: number
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
