type CommandMeta = {
  id: string
}

type CommandExecutor<Args extends any[], Return> = (
  ...args: Args
) => Return | Promise<Return>

export class CommandCenter {
  private map = new Map<string, Command<any, any>>()

  add(command: Command<any, any>) {
    this.map.set(command.id, command)
    return command
  }

  get(id: string) {
    const c = this.map.get(id)
    if (!c) throw new Error("Command Not Found: " + id)
    return c
  }
}

export const commands = new CommandCenter()

export class Command<Args extends any[], Return> {
  constructor(
    private meta: CommandMeta,
    private exec: CommandExecutor<Args, Return>
  ) {}

  get id() {
    return this.meta.id
  }

  run(...args: Args) {
    return this.exec(...args)
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
