import {shell} from "electron"
import {createOperation} from "../../../core/operations"

export const openLinkOp = createOperation("openLinkOp", (_ctx, url: string) => {
  shell.openExternal(url)
})
