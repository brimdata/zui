import {createOperation} from "../operations"

export const closeWindow = createOperation("closeWindow", (main) => {
  main.windows.closeWindow()
})
