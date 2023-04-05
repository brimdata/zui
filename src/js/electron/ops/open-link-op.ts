import {shell} from "electron"
import {createOperation} from "../operations"

export const openLinkOp = createOperation("openLinkOp", (_ctx, url: string) => {
  shell.openExternal(url)
})
