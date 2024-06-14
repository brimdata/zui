import {DomainModel} from "src/core/domain-model"
import {LakeAttrs} from "../state/Lakes/types"

export class Lake extends DomainModel<LakeAttrs> {
  getAddress(): string {
    return this.attrs.port
      ? [this.attrs.host, this.attrs.port].join(":")
      : this.attrs.host
  }

  serialize(): LakeAttrs {
    return {...this.attrs}
  }

  get authType() {
    return this.attrs.authType
  }

  get authData() {
    return this.attrs.authData
  }

  get name() {
    return this.attrs.name
  }

  get id() {
    return this.attrs.id
  }

  get host() {
    return this.attrs.host
  }

  get port() {
    return this.attrs.port
  }

  get version() {
    return this.attrs.version
  }
}
