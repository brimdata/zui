import {createOperation} from "src/core/operations"
import {window} from "src/zui"
import {OpenDialogOptions, dialog} from "electron"

export const sync = createOperation(
  "window.sync",
  (ctx, props: {lakeId: string; id: string}) => {
    window.sync(props)
  }
)

export const showOpenDialog = createOperation(
  "window.showOpenDialog",
  (ctx, options: OpenDialogOptions = {}) => dialog.showOpenDialog(options)
)
