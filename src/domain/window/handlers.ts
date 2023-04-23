import {createHandler} from "src/core/handlers"
import toast from "react-hot-toast"

createHandler("window.showErrorMessage", (_ctx, message) => {
  toast.error(message)
})

createHandler("window.showMessage", (_ctx, message) => {
  console.log(message)
  toast(message)
})

createHandler("window.showSuccessMessage", (_ctx, message) => {
  toast.success(message)
})
