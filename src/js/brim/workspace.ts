import {Workspace} from "../state/Workspaces/types"

export default function workspace(ws: Workspace) {
  return {
    ...ws,
    getAddress(): string {
      return this.port ? [this.host, this.port].join(":") : this.host
    },
    serialize(): Workspace {
      return {
        host: this.host,
        id: this.id,
        name: this.name,
        port: this.port,
        version: this.version,
        authType: this.authType,
        authData: this.authData
      }
    }
  }
}
