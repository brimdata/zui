import {createOperation} from "../../core/operations"
import {shell} from "electron"

export const openLinkOp = createOperation("openLinkOp", (_ctx, url: string) => {
  shell.openExternal(url)
})
