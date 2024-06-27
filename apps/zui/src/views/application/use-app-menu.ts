import {createSelector} from "@reduxjs/toolkit"
import {useEffect} from "react"
import {useSelector} from "react-redux"
import {invoke} from "src/core/invoke"
import {SearchAppMenuState} from "src/electron/windows/search/app-menu"
import Appearance from "src/js/state/Appearance"
import Current from "src/js/state/Current"
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
  Current.getRouteName,
  (showLeftPane, showRightPane, showHistogram, routeName) => {
    return {
      showLeftPane,
      showRightPane,
      showHistogram,
      routeName,
    } as SearchAppMenuState
  }
)

export function useAppMenu() {
  const state = useSelector(getAppMenuState)

  useEffect(() => {
    const update = () => {
      invoke("updateSearchAppMenu", global.windowId, state)
    }

    update()
    return global.zui.on("updateSearchAppMenu", update)
  }, [state])
}
