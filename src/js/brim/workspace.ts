import {Workspace} from "../state/Workspaces/types"

export default function workspace(ws: Workspace) {
  return {
    ...ws,
    getAddress(): string {
      return [this.host, this.port].join(":")
    },
    serialize(): Workspace {
      return {
        host: this.host,
        id: this.id,
        name: this.name,
        port: this.port
      }
    }
  }
}
