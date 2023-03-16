import {zed} from "@brimdata/zealot"
import {View} from "./view"

export class TypeValueView extends View<zed.TypeValue> {
  render() {
    return `<${this.value.toString()}>`
  }
}
