import {isNull} from "../utils"
import {TypeSet} from "../types/type-set"
import {ZedValue, ZedValueInterface} from "./types"

export class Set implements ZedValueInterface {
  constructor(public type: TypeSet, public items: ZedValue[] | null) {}

  toString() {
    if (isNull(this.items)) return "null"
    const contents = this.items.map((i) => i.toString()).join(",")
    return `|[${contents}]|`
  }

  serialize() {
    if (isNull(this.items)) return null
    return this.items.map((i) => i.serialize())
  }

  isUnset() {
    return isNull(this.items)
  }
}
