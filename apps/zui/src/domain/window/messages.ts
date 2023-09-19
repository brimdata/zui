import {OpenDialogOptions, OpenDialogReturnValue} from "electron"
import {QueryParams} from "src/js/api/queries/types"

export type WindowHandlers = {
  "window.showErrorMessage": [message: string]
  "window.showMessage": [message: string]
  "window.showSuccessMessage": [message: string]
  "window.showWelcomePage": []
  "window.query": [params: QueryParams]
}

export type WindowOperations = {
  "window.sync": (props: {lakeId: string}) => void
  "window.showOpenDialog": (
    options?: OpenDialogOptions
  ) => OpenDialogReturnValue
}
