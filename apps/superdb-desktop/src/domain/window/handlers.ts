import {createHandler} from "src/core/handlers"
import toast from "react-hot-toast"
import Tabs from "src/js/state/Tabs"
import {welcomePath} from "src/app/router/utils/paths"
import {PaneName} from "src/js/state/Layout/types"
import Appearance from "src/js/state/Appearance"
import Layout from "src/js/state/Layout"
import Modal from "src/js/state/Modal"

export const showErrorMessage = createHandler(
  "window.showErrorMessage",
  (_ctx, message) => {
    toast.error(message)
  }
)

export const showMessage = createHandler(
  "window.showMessage",
  (_ctx, message) => {
    toast(message)
  }
)

export const showSuccessMessage = createHandler(
  "window.showSuccessMessage",
  (_ctx, message) => {
    toast.success(message)
  }
)

export const showWelcomePage = createHandler(
  "window.showWelcomePage",
  ({dispatch}) => {
    dispatch(Tabs.activateUrl(welcomePath()))
  }
)

export const openTab = createHandler(
  "window.openTab",
  ({dispatch}, path: string) => {
    dispatch(Tabs.activateUrl(path))
  }
)

export const activatePane = createHandler(({dispatch}, name: PaneName) => {
  dispatch(Appearance.showSecondarySidebar())
  dispatch(Layout.setCurrentPaneName(name))
})

export const togglePane = createHandler(
  ({select, dispatch}, name: PaneName) => {
    if (
      select(Appearance.secondarySidebarIsOpen) &&
      select(Layout.getCurrentPaneName) === name
    ) {
      dispatch(Appearance.toggleSecondarySidebar())
    } else {
      dispatch(Appearance.showSecondarySidebar())
      dispatch(Layout.setCurrentPaneName(name))
    }
  }
)

export const hideModal = createHandler(({dispatch}) => {
  dispatch(Modal.hide())
})
