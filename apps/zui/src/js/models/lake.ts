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
}
