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

type CommandExecutor = (context: CommandContext) => void

export class Commands {
  private map = new Map<string, Command>()
  private store: Store | null
  private api: BrimApi | null

  add(command: Command) {
    this.map.set(command.id, command)
    return command
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

export class Command {
  constructor(private meta: CommandMeta, private exec: CommandExecutor) {}

  get id() {
    return this.meta.id
  }

  run() {
    return this.exec(commands.context)
  }
}

export const createCommand = (meta: CommandMeta, exec: CommandExecutor) => {
  return commands.add(new Command(meta, exec))
}
