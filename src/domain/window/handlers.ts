import {createHandler} from "src/core/handlers"
import toast from "react-hot-toast"
import Tabs from "src/js/state/Tabs"
import {lakePath} from "src/app/router/utils/paths"
import Current from "src/js/state/Current"

createHandler("window.showErrorMessage", (_ctx, message) => {
  toast.error(message)
})

createHandler("window.showMessage", (_ctx, message) => {
  toast(message)
})

createHandler("window.showSuccessMessage", (_ctx, message) => {
  toast.success(message)
})

createHandler("window.showWelcomePage", ({dispatch, select}) => {
  const lakeId = select(Current.getLakeId)
  dispatch(Tabs.activateUrl(lakePath(lakeId)))
})
