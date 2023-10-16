import {createHandler} from "src/core/handlers"
import toast from "react-hot-toast"
import Tabs from "src/js/state/Tabs"
import {welcomePath} from "src/app/router/utils/paths"
import {QueryParams} from "src/js/api/queries/types"

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

export const query = createHandler(
  "window.query",
  (ctx, params: QueryParams) => {
    ctx.dispatch((d, getState, {api}) => {
      api.queries.open(params)
    })
  }
)

export const openTab = createHandler(
  "window.openTab",
  ({dispatch}, path: string) => {
    console.log("Opening the tab", path)
    dispatch(Tabs.activateUrl(path))
  }
)
