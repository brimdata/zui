import * as zed from "@brimdata/zed-js"
import {View} from "./view"

export class ExplicitPrimitiveView extends View<zed.Value> {
  get decorator(): string {
    return this.type.toString()
  }
}
