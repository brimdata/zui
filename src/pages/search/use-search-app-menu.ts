import {createSelector} from "@reduxjs/toolkit"
import {ipcRenderer} from "electron"
import {useEffect} from "react"
import {useSelector} from "react-redux"
import {updateSearchAppMenuOp} from "src/js/electron/ops/update-search-app-menu-op"
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
      updateSearchAppMenuOp.invoke(global.windowId, state)
    }

    update()
    ipcRenderer.on("updateSearchAppMenu", update)
    return () => {
      ipcRenderer.off("updateSearchAppMenu", update)
    }
  }, [state])
}
