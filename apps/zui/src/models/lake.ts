import {DomainModel} from "src/core/domain-model"
import {LakeAttrs} from "../js/state/Lakes/types"
import {Client} from "@brimdata/zed-js"
import Slice from "src/js/state/Lakes"
import {FeatureDetector} from "./lake/feature-detector"

export class Lake extends DomainModel<LakeAttrs> {
  static find(id: string) {
    const attrs = this.select(Slice.id(id))
    if (!attrs) return null
    return new Lake(attrs)
  }

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

  get client() {
    return new Client(this.getAddress())
  }

  get features() {
    return this.attrs.features ?? ({} as any)
  }

  async sync() {
    // Also authenticate (later)
    // Also check status (later)
    const detector = new FeatureDetector(this)
    const features = await detector.detect()
    this.update({features})
  }

  update(changes: Partial<LakeAttrs>) {
    this.attrs = {...this.attrs, ...changes}
    this.dispatch(Slice.update({id: this.id, changes}))
  }

  save() {
    this.dispatch(Slice.add({...this.attrs}))
  }

  isRunning() {
    return this.client
      .version()
      .then(() => true)
      .catch(() => false)
  }
}
