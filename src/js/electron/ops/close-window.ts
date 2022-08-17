import {createOperation} from "../main-op"

export const closeWindow = createOperation("closeWindow", (main) => {
  main.windows.closeWindow()
})
