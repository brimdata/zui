import {derivePoolName} from "src/js/models/ingest/getParams"
import {createOperation} from "../operations"

export const derivePoolNameOp = createOperation(
  "derivePoolNameOp",
  (ctx, fileListData, existingNames) => {
    derivePoolName(fileListData, existingNames)
  }
)
