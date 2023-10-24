import {createHandler} from "src/core/handlers"
import {previewLoadFiles} from "./preview-load-files"

export const chooseFiles = createHandler(async ({invoke}, poolId?: string) => {
  const result = await invoke("window.showOpenDialog", {
    properties: ["openFile", "multiSelections"],
  })
  if (!result.canceled && result.filePaths.length) {
    previewLoadFiles({files: result.filePaths, poolId})
  }
})
