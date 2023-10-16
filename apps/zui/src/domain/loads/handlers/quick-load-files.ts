import {createHandler} from "src/core/handlers"

export const quickLoadFiles = createHandler(
  (ctx, args: {files: string[]; poolId?: string}) => {
    if (args.files.length === 0) {
      ctx.toast.error("No Files Provided")
      return
    }

    ctx.invoke("loads.create", {
      windowId: globalThis.windowId,
      poolId: args.poolId || "new",
      files: args.files,
      author: "Zui",
      body: "Quick Load",
      shaper: "",
      format: "auto",
    })
  }
)
