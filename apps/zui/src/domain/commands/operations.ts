import {sendToFocusedWindow} from "src/core/ipc"
import {createOperation} from "src/core/operations"
import {commands} from "src/zui"

export const run = createOperation(
  "commands.run",
  (ctx, name: string, ...args: any[]) => {
    if (commands.has(name)) {
      const run = commands.get(name)
      run(...args)
    } else {
      sendToFocusedWindow(name as any, ...(args as any[]))
    }
  }
)
