import {createOperation} from "../../core/operations"
import {derivePoolName} from "src/domain/pools/utils"

// Remove this, doesn't need to be an op
export const derivePoolNameOp = createOperation(
  "derivePoolNameOp",
  (_, files: string[], existingNames: string[]) => {
    return derivePoolName(files, existingNames)
  }
)

export type DerivePoolNameOp = typeof derivePoolNameOp
