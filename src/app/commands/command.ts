import BrimApi from "src/js/api"
import {Dispatch, GetState, Store} from "src/js/state/types"

type CommandMeta = {
  id: string
}

type CommandContext = {
  dispatch: Dispatch
  getState: GetState
  api: BrimApi
}

type CommandExecutor<Args extends any[]> = (
  context: CommandContext,
  ...args: Args
) => void

export class Commands {
  private map = new Map<string, Command<any>>()
  private store: Store | null
  private api: BrimApi | null

  add(command: Command<any>) {
    this.map.set(command.id, command)
    return command
  }

  run(id: string, ...args: any[]) {
    const cmd = this.map.get(id)
    if (cmd) cmd.run(...args)
    else console.log("No command found: ", id)
  }

  get context() {
    if (!this.store || !this.api)
      throw new Error("Must set command context before accessing")
    return {
      dispatch: this.store.dispatch,
      getState: this.store.getState,
      api: this.api,
    }
  }

  setContext(store: Store, api: BrimApi) {
    this.store = store
    this.api = api
  }
}

export const commands = new Commands()

export class Command<Args extends any[]> {
  constructor(private meta: CommandMeta, private exec: CommandExecutor<Args>) {}

  get id() {
    return this.meta.id
  }

  run(...args: Args) {
    return this.exec(commands.context, ...args)
  }
}

export const createCommand = <Args extends any[] = never>(
  meta: CommandMeta,
  exec: CommandExecutor<Args>
) => {
  const cmd = new Command<Args>(meta, exec)
  commands.add(cmd)
  return cmd
}
