import {dialog} from "electron"
import {createOperation} from "../operations"

export const resetStateOp = createOperation("resetState", async ({main}) => {
  const {response} = await dialog.showMessageBox({
    message: "Are you sure?",
    detail: "This will reset local app state but retain lake data.",
    buttons: ["OK", "Cancel"],
  })
  if (response === 0) await main.resetState()
})
