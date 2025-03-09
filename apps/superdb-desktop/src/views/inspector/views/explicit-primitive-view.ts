import * as zed from "../../../../../../packages/superdb-types/dist"
import {View} from "./view"

export class ExplicitPrimitiveView extends View<zed.Value> {
  get decorator(): string {
    return this.type.toString()
  }
}
