import {View} from "./view"
import * as zed from "../../../../../../packages/superdb-types/dist"

export class NullView extends View<zed.Any> {
  get showDecorator() {
    return !zed.isPrimitiveType(this.type)
  }

  get decorator(): string {
    return this.type.toString()
  }

  render() {
    return "null"
  }
}
