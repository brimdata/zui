import {createSelector} from "@reduxjs/toolkit"
import {useEffect} from "react"
import {useSelector} from "react-redux"
import {invoke} from "src/core/invoke"
import {SearchAppMenuState} from "src/electron/windows/search/app-menu"
import Appearance from "src/js/state/Appearance"
import Layout from "src/js/state/Layout"
import {State} from "src/js/state/types"

function tryShowHistogram(state: State) {
  try {
    return Layout.getShowHistogram(state)
  } catch {
    return false
  }
}

const getAppMenuState = createSelector(
  Appearance.sidebarIsOpen,
  Appearance.secondarySidebarIsOpen,
  tryShowHistogram,
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
    global.zui.on("updateSearchAppMenu", update)
    return () => {
      global.zui.off("updateSearchAppMenu", update)
    }
  }, [state])
}
