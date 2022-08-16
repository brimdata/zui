import {mainOp} from "../main-op"

export const closeWindow = mainOp("closeWindow", (main) => {
  main.windows.closeWindow()
})
