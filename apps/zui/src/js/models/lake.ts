import {LakeAttrs} from "../state/Lakes/types"

export type LakeModel = ReturnType<typeof lake>

export default function lake(lake: LakeAttrs) {
  return {
    ...lake,
    getAddress(): string {
      return this.port ? [this.host, this.port].join(":") : this.host
    },
    serialize(): LakeAttrs {
      return {
        host: this.host,
        id: this.id,
        name: this.name,
        port: this.port,
        version: this.version,
        authType: this.authType,
        authData: this.authData,
      }
    },
  }
}
