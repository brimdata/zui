export class CommandsApi {
  cmds = new Map()

  create(name: string, handler: (...args: any[]) => any) {
    if (this.has(name)) {
      throw new Error("Command already exists named: " + name)
    }
    this.cmds.set(name, handler)
  }

  has(name: string) {
    return this.cmds.has(name)
  }

  get(name: string) {
    if (!this.has(name)) {
      throw new Error("Command not found: " + name)
    }
    return this.get(name)
  }

  _teardown() {
    this.cmds = new Map()
  }
}
