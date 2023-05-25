import {createOperation} from "../../core/operations"
import open from "src/js/lib/open"

export const openLinkOp = createOperation("openLinkOp", (_ctx, url: string) => {
  open(url)
})
