import {commands} from "src/core/command"
import {createOperation} from "../operations"

export const invokeCommandOp = createOperation(
  "invokeCommandOp",
  (_, id: string, args?: any[]) => {
    return commands.get(id).run(...(args ?? []))
  }
)

export type InvokeCommandOp = typeof invokeCommandOp
