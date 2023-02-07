import {TypeValue} from "packages/zealot/src/zed"
import {View} from "./view"

export class TypeValueView extends View<TypeValue> {
  render() {
    return `<${this.value.toString()}>`
  }
}
