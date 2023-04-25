import {createSelector} from "@reduxjs/toolkit"
import {useEffect} from "react"
import {useSelector} from "react-redux"
import {invoke} from "src/core/invoke"
import {SearchAppMenuState} from "src/js/electron/windows/search/app-menu"
import Appearance from "src/js/state/Appearance"
import Layout from "src/js/state/Layout"

const getAppMenuState = createSelector(
  Appearance.sidebarIsOpen,
  Layout.getDetailPaneIsOpen,
  Layout.getShowHistogram,
  (showLeftPane, showRightPane, showHistogram) => {
    return {
      showLeftPane,
      showRightPane,
      showHistogram,
    } as SearchAppMenuState
  }
)

export function useSearchAppMenu() {
  const state = useSelector(getAppMenuState)

  useEffect(() => {
    const update = () => {
      invoke("updateSearchAppMenu", global.windowId, state)
    }

    update()
    global.zui.listen("updateSearchAppMenu", update)
    return () => {
      global.zui.stopListen("updateSearchAppMenu", update)
    }
  }, [state])
}
