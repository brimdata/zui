import {jsup, decode} from "../../../../../packages/superdb-types/dist"
import {createOperation} from "../../core/operations"
import {OpEventContext} from "src/js/state/Current/selectors"
import {session} from "src/zui"

export const emitRowDetailChangeOp = createOperation(
  "emitRowDetailChangeOp",
  (_, event: OpEventContext, jsup: jsup.Obj) => {
    const row = decode(jsup)
    session.selectedRow = row
    session.emit("result-selection-change", {row})
  }
)

export type EmitRowDetailChangeOp = typeof emitRowDetailChangeOp
