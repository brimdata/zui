import {session} from "src/zui"
import {createOperation} from "../operations"

export const updatePluginSessionOp = createOperation(
  "updatePluginSessionOp",
  (_, state: {poolName: string; program: string}) => {
    session.poolName = state.poolName
    session.program = state.program
  }
)

export type UpdatePluginSessionOp = typeof updatePluginSessionOp
