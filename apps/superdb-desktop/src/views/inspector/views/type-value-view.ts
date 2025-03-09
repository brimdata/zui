import {TypeValue} from "../../../../../../packages/superdb-types/dist"
import {View} from "./view"

export class TypeValueView extends View<TypeValue> {
  render() {
    return `<${this.value.toString()}>`
  }
}
