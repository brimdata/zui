export type ColumnHeadersViewState = "AUTO" | "ON" | "OFF"
export type InvestigationView = "tree" | "linear"
export type LayoutState = {
  rightSidebarWidth: number
  rightSidebarIsOpen: boolean
  investigationView: InvestigationView
  columnHeadersView: ColumnHeadersViewState
}

export type LayoutAction =
  | LAYOUT_RIGHT_SIDEBAR_SHOW
  | LAYOUT_RIGHT_SIDEBAR_HIDE
  | LAYOUT_RIGHT_SIDEBAR_TOGGLE
  | LAYOUT_RIGHT_SIDEBAR_WIDTH_SET
  | LAYOUT_INVESTIGATION_VIEW_SET
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
  type: "LAYOUT_RIGHT_SIDEBAR_WIDTH_SET"
  width: number
}

export type LAYOUT_INVESTIGATION_VIEW_SET = {
  type: "LAYOUT_INVESTIGATION_VIEW_SET"
  view: InvestigationView
}

export type LAYOUT_SET_COLUMN_HEADERS = {
  type: "LAYOUT_SET_COLUMN_HEADERS"
  view: ColumnHeadersViewState
}
