import {Lake} from "../state/Lakes/types"

export default function lake(lake: Lake) {
  return {
    ...lake,
    getAddress(): string {
      return this.port ? [this.host, this.port].join(":") : this.host
    },
    serialize(): Lake {
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
