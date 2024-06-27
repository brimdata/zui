import {loads} from "src/zui"
import {createLoadRef} from "../load-ref"
import {createOperation} from "src/core/operations"

export const cancel = createOperation(
  "loads.cancel",
  (ctx, poolId: string, files: string[], query: string) => {
    loads.emit("abort", createLoadRef("new", poolId, files, query))
  }
)
