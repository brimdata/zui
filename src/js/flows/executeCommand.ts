import {Thunk} from "../state/types"

export const executeCommand = (command: string, ...args: any[]): Thunk => (
  dispatch,
  _gs,
  {api}
) => {
  api.commands.execute(command, args)
}
