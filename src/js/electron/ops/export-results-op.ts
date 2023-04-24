import exportResults from "src/js/flows/exportResults"
import {createOperation} from "../../../core/operations"
import {ResponseFormat} from "@brimdata/zed-js"

export const exportResultsOp = createOperation(
  "exportResultsOp",
  (ctx, filePath: string, format: string) => {
    ctx.main.store.dispatch(exportResults(filePath, format as ResponseFormat))
  }
)
