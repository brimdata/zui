import {DomainModel} from "src/core/domain-model"
import {LakeAttrs} from "../js/state/Lakes/types"
import {Client} from "@brimdata/zed-js"
import Slice from "src/js/state/Lakes"
import LakeStatuses from "src/js/state/LakeStatuses"
import {LakeStatus} from "src/js/state/LakeStatuses/types"
import {FeatureDetector} from "./lake/feature-detector"

type LakeModelAttrs = LakeAttrs & {status: LakeStatus}

export class Lake extends DomainModel<LakeModelAttrs> {
  static find(id: string) {
    const attrs = this.select(Slice.id(id))
    const status = this.select(LakeStatuses.get(id))
    return new Lake({...attrs, status})
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

  update(attrs: Partial<LakeModelAttrs>) {
    this.attrs = {...this.attrs, ...attrs}
    this.save()
  }

  save() {
    const {status: _, ...attrs} = this.attrs
    this.dispatch(Slice.add(attrs))
  }

  isRunning() {
    return this.client
      .version()
      .then(() => true)
      .catch(() => false)
  }
}
