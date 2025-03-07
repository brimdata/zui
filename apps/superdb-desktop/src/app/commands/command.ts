import ZuiApi from "src/js/api/zui-api"
import {Dispatch, GetState, Store} from "src/js/state/types"

type CommandMeta = {
  id: string
}

type CommandContext = {
  dispatch: Dispatch
  getState: GetState
  api: ZuiApi
}

type CommandExecutor<Args extends any[], Return> = (
  context: CommandContext,
  ...args: Args
) => Return | Promise<Return>

export class Commands {
  private map = new Map<string, Command<any, any>>()
  private store: Store | null
  private api: ZuiApi | null

  add(command: Command<any, any>) {
    this.map.set(command.id, command)
    return command
  }

  run(id: string | {id: string}, ...args: any[]) {
    const cmdId = typeof id === "string" ? id : id.id
    const cmd = this.map.get(cmdId)
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

  setContext(store: Store, api: ZuiApi) {
    this.store = store
    this.api = api
  }
}

export const commands = new Commands()

export class Command<Args extends any[], Return> {
  constructor(
    private meta: CommandMeta,
    private exec: CommandExecutor<Args, Return>
  ) {}

  get id() {
    return this.meta.id
  }

  run(...args: Args) {
    return this.exec(commands.context, ...args)
  }

  bind(...args: Args) {
    return new BoundCommand<Args, Return>(this, args)
  }
}

export class BoundCommand<Args extends any[], Return> {
  args: Args

  constructor(public command: Command<Args, Return>, args: Args) {
    this.args = args
  }

  run() {
    return this.command.run(...this.args)
  }
}

export const createCommand = <Args extends any[] = never, Return = void>(
  meta: CommandMeta | string,
  exec: CommandExecutor<Args, Return>
) => {
  const cmdMeta = typeof meta === "string" ? {id: meta} : meta
  const cmd = new Command<Args, Return>(cmdMeta, exec)
  commands.add(cmd)
  return cmd
}
