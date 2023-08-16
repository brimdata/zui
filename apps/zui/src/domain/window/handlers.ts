import {createHandler} from "src/core/handlers"
import toast from "react-hot-toast"
import Tabs from "src/js/state/Tabs"
import {welcomePath} from "src/app/router/utils/paths"
import {QueryParams} from "src/js/api/queries/types"

createHandler("window.showErrorMessage", (_ctx, message) => {
  toast.error(message)
})

createHandler("window.showMessage", (_ctx, message) => {
  toast(message)
})

createHandler("window.showSuccessMessage", (_ctx, message) => {
  toast.success(message)
})

createHandler("window.showWelcomePage", ({dispatch}) => {
  dispatch(Tabs.activateUrl(welcomePath()))
})

createHandler("window.query", (ctx, params: QueryParams) => {
  ctx.dispatch((d, getState, {api}) => {
    api.queries.open(params)
  })
})
