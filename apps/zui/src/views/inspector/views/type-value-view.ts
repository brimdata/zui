import {TypeValue} from "@brimdata/zed-js"
import {View} from "./view"

export class TypeValueView extends View<TypeValue> {
  render() {
    return `<${this.value.toString()}>`
  }
}
