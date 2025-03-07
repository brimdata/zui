import {MessageBoxOptions, dialog} from "electron"
import {createOperation} from "../../core/operations"

export const showMessageBoxOp = createOperation(
  "showMessageBoxOp",
  (_, opts: MessageBoxOptions) => {
    return dialog.showMessageBox(opts)
  }
)
