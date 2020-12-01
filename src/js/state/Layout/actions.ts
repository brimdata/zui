import {SectionData} from "../../../pkg/sectional"
import {
  LAYOUT_INVESTIGATION_VIEW_SET,
  InvestigationView,
  LAYOUT_LEFT_SIDEBAR_HIDE,
  LAYOUT_LEFT_SIDEBAR_SHOW,
  LAYOUT_LEFT_SIDEBAR_TOGGLE,
  LAYOUT_LEFT_SIDEBAR_WIDTH_SET,
  LAYOUT_RIGHT_SIDEBAR_HIDE,
  LAYOUT_RIGHT_SIDEBAR_SHOW,
  LAYOUT_RIGHT_SIDEBAR_TOGGLE,
  LAYOUT_RIGHT_SIDEBAR_WIDTH_SET,
  LAYOUT_HISTORY_HEIGHT_SET,
  LAYOUT_SPACES_HEIGHT_SET,
  LAYOUT_HISTORY_TOGGLE,
  LAYOUT_SPACES_TOGGLE,
  LAYOUT_SIDEBAR_SECTIONS_SET
} from "./types"

export default {
  setSidebarSections: (
    sections: SectionData[]
  ): LAYOUT_SIDEBAR_SECTIONS_SET => ({
    type: "LAYOUT_SIDEBAR_SECTIONS_SET",
    sections
  }),

  showRightSidebar: (): LAYOUT_RIGHT_SIDEBAR_SHOW => ({
    type: "LAYOUT_RIGHT_SIDEBAR_SHOW"
  }),

  hideRightSidebar: (): LAYOUT_RIGHT_SIDEBAR_HIDE => ({
    type: "LAYOUT_RIGHT_SIDEBAR_HIDE"
  }),

  setRightSidebarWidth: (width: number): LAYOUT_RIGHT_SIDEBAR_WIDTH_SET => ({
    type: "LAYOUT_RIGHT_SIDEBAR_WIDTH_SET",
    width
  }),

  toggleRightSidebar: (): LAYOUT_RIGHT_SIDEBAR_TOGGLE => ({
    type: "LAYOUT_RIGHT_SIDEBAR_TOGGLE"
  }),

  showLeftSidebar: (): LAYOUT_LEFT_SIDEBAR_SHOW => ({
    type: "LAYOUT_LEFT_SIDEBAR_SHOW"
  }),

  hideLeftSidebar: (): LAYOUT_LEFT_SIDEBAR_HIDE => ({
    type: "LAYOUT_LEFT_SIDEBAR_HIDE"
  }),

  setLeftSidebarWidth: (width: number): LAYOUT_LEFT_SIDEBAR_WIDTH_SET => ({
    type: "LAYOUT_LEFT_SIDEBAR_WIDTH_SET",
    width
  }),

  toggleLeftSidebar: (): LAYOUT_LEFT_SIDEBAR_TOGGLE => ({
    type: "LAYOUT_LEFT_SIDEBAR_TOGGLE"
  }),

  setHistoryHeight: (height: number): LAYOUT_HISTORY_HEIGHT_SET => ({
    type: "LAYOUT_HISTORY_HEIGHT_SET",
    height
  }),

  setSpacesHeight: (height: number): LAYOUT_SPACES_HEIGHT_SET => ({
    type: "LAYOUT_SPACES_HEIGHT_SET",
    height
  }),

  toggleHistory: (): LAYOUT_HISTORY_TOGGLE => ({
    type: "LAYOUT_HISTORY_TOGGLE"
  }),

  toggleSpaces: (): LAYOUT_SPACES_TOGGLE => ({
    type: "LAYOUT_SPACES_TOGGLE"
  }),

  setInvestigationView: (
    view: InvestigationView
  ): LAYOUT_INVESTIGATION_VIEW_SET => ({
    type: "LAYOUT_INVESTIGATION_VIEW_SET",
    view
  }),

  setColumnHeadersView(view: string) {
    return {type: "LAYOUT_SET_COLUMN_HEADERS", view}
  }
}
