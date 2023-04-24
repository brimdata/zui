import {zjson, decode} from "@brimdata/zed-js"
import {createOperation} from "../../../core/operations"
import {OpEventContext} from "src/js/state/Current/selectors"
import {session} from "src/zui"

export const emitRowDetailChangeOp = createOperation(
  "emitRowDetailChangeOp",
  (_, event: OpEventContext, zjson: zjson.Obj) => {
    const row = decode(zjson)
    session.selectedRow = row
    session.emit("result-selection-change", {row})
  }
)

export type EmitRowDetailChangeOp = typeof emitRowDetailChangeOp
