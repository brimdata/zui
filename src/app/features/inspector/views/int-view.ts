import {zed} from "@brimdata/zealot"
import {View} from "./view"

export class IntView extends View<zed.Value> {
  get decorator(): string {
    return this.type.toString()
  }
}
