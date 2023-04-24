import {session} from "src/zui"
import {createOperation} from "../../../core/operations"

export const updatePluginSessionOp = createOperation(
  "updatePluginSessionOp",
  (_, state: {poolName: string; program: string}) => {
    // Maybe change this to emit a change pool and change program event
    session.poolName = state.poolName
    session.program = state.program
  }
)

export type UpdatePluginSessionOp = typeof updatePluginSessionOp
