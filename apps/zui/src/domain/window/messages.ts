import {OpenDialogOptions, OpenDialogReturnValue} from "electron"
import {QueryParams} from "src/js/api/queries/types"

export type WindowHandlers = {
  "window.showErrorMessage": (message: string) => void
  "window.showMessage": (message: string) => void
  "window.showSuccessMessage": (message: string) => void
  "window.showWelcomePage": () => void
  "window.query": (params: QueryParams) => void
}

export type WindowOperations = {
  "window.sync": (props: {lakeId: string}) => void
  "window.showOpenDialog": (
    options?: OpenDialogOptions
  ) => OpenDialogReturnValue
}
