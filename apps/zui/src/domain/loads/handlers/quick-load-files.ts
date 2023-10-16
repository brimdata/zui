import {createHandler} from "src/core/handlers"

export const quickLoadFiles = createHandler((ctx, files: string[]) => {
  if (files.length === 0) {
    ctx.toast.error("No Files Provided")
    return
  }

  ctx.invoke("loads.create", {
    windowId: globalThis.windowId,
    poolId: "new",
    files: files,
    author: "Zui",
    body: "Quick Load",
    shaper: "",
    format: "auto",
  })
})
