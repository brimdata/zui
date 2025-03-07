import {EventEmitter} from "events"

type Cleanup = () => any

export class CommandsApi {
  commandRegistry: EventEmitter

  constructor() {
    this.commandRegistry = new EventEmitter()
  }

  add(command: string, listener: (...args: any[]) => void): Cleanup {
    this.commandRegistry.on(command, listener)
    return () => this.commandRegistry.removeListener(command, listener)
  }

  execute(command: string, ...args: any[]): boolean {
    return this.commandRegistry.emit(command, ...args)
  }

  list(): string[] {
    return this.commandRegistry.eventNames() as string[]
  }
}
