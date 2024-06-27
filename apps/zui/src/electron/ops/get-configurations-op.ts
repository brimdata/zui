import {configurations} from "src/zui"
import {createOperation} from "../../core/operations"

export const getConfigurationsOp = createOperation(
  "getConfigurationsOp",
  () => {
    return configurations.all
  }
)
export type GetConfigurationsOp = typeof getConfigurationsOp
