import {createOperation} from "src/core/operations"
import {window} from "src/zui"
import {dialog} from "electron"

export const sync = createOperation("window.sync", (ctx, props) => {
  console.log("calling sync", props.lakeId)
  window.lakeId = props.lakeId
})

export const showOpenDialog = createOperation(
  "window.showOpenDialog",
  (ctx, options = {}) => dialog.showOpenDialog(options)
)
