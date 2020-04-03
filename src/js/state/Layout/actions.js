/* @flow */
import type {
  LAYOUT_RIGHT_SIDEBAR_HIDE,
  LAYOUT_RIGHT_SIDEBAR_SHOW,
  LAYOUT_RIGHT_SIDEBAR_TOGGLE,
  LAYOUT_RIGHT_SIDEBAR_WIDTH_SET
} from "./types"

export default {
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
  })
}
