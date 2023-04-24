import {correlations} from "src/zui"
import {createOperation} from "../operations"

export const getCorrelationsOp = createOperation("getCorrelationsOp", () => {
  return correlations.compile()
})

export type GetCorrelationsOp = typeof getCorrelationsOp
