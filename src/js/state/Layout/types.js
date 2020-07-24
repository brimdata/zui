/* @flow */

export type ColumnHeadersViewState = "AUTO" | "ON" | "OFF"
export type InvestigationView = "tree" | "linear"
export type LayoutState = {
  rightSidebarWidth: number,
  rightSidebarIsOpen: boolean,
  leftSidebarWidth: number,
  leftSidebarIsOpen: boolean,
  investigationView: InvestigationView,
  historyHeight: number,
  historyIsOpen: boolean,
  spacesHeight: number,
  spacesIsOpen: boolean,
  columnHeadersView: ColumnHeadersViewState
}

export type LayoutAction =
  | LAYOUT_RIGHT_SIDEBAR_SHOW
  | LAYOUT_RIGHT_SIDEBAR_HIDE
  | LAYOUT_RIGHT_SIDEBAR_TOGGLE
  | LAYOUT_RIGHT_SIDEBAR_WIDTH_SET
  | LAYOUT_LEFT_SIDEBAR_SHOW
  | LAYOUT_LEFT_SIDEBAR_HIDE
  | LAYOUT_LEFT_SIDEBAR_TOGGLE
  | LAYOUT_LEFT_SIDEBAR_WIDTH_SET
  | LAYOUT_INVESTIGATION_VIEW_SET
  | LAYOUT_HISTORY_HEIGHT_SET
  | LAYOUT_SPACES_HEIGHT_SET
  | LAYOUT_HISTORY_TOGGLE
  | LAYOUT_SPACES_TOGGLE
  | LAYOUT_SET_COLUMN_HEADERS

export type LAYOUT_RIGHT_SIDEBAR_SHOW = {
  type: "LAYOUT_RIGHT_SIDEBAR_SHOW"
}

export type LAYOUT_RIGHT_SIDEBAR_HIDE = {
  type: "LAYOUT_RIGHT_SIDEBAR_HIDE"
}

export type LAYOUT_RIGHT_SIDEBAR_TOGGLE = {
  type: "LAYOUT_RIGHT_SIDEBAR_TOGGLE"
}

export type LAYOUT_RIGHT_SIDEBAR_WIDTH_SET = {
  type: "LAYOUT_RIGHT_SIDEBAR_WIDTH_SET",
  width: number
}

export type LAYOUT_LEFT_SIDEBAR_SHOW = {
  type: "LAYOUT_LEFT_SIDEBAR_SHOW"
}

export type LAYOUT_LEFT_SIDEBAR_HIDE = {
  type: "LAYOUT_LEFT_SIDEBAR_HIDE"
}

export type LAYOUT_LEFT_SIDEBAR_TOGGLE = {
  type: "LAYOUT_LEFT_SIDEBAR_TOGGLE"
}

export type LAYOUT_LEFT_SIDEBAR_WIDTH_SET = {
  type: "LAYOUT_LEFT_SIDEBAR_WIDTH_SET",
  width: number
}

export type LAYOUT_INVESTIGATION_VIEW_SET = {
  type: "LAYOUT_INVESTIGATION_VIEW_SET",
  view: InvestigationView
}

export type LAYOUT_HISTORY_HEIGHT_SET = {
  type: "LAYOUT_HISTORY_HEIGHT_SET",
  height: number
}

export type LAYOUT_SPACES_HEIGHT_SET = {
  type: "LAYOUT_SPACES_HEIGHT_SET",
  height: number
}

export type LAYOUT_HISTORY_TOGGLE = {
  type: "LAYOUT_HISTORY_TOGGLE"
}

export type LAYOUT_SPACES_TOGGLE = {
  type: "LAYOUT_SPACES_TOGGLE"
}

export type LAYOUT_SET_COLUMN_HEADERS = {
  type: "LAYOUT_SET_COLUMN_HEADERS",
  view: ColumnHeadersViewState
}
