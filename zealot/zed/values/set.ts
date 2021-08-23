import {isNull} from "../utils"
import {TypeSet} from "../types/type-set"
import {ZedValue, ZedValueInterface} from "./types"

export class Set implements ZedValueInterface {
  constructor(public type: TypeSet, public items: ZedValue[] | null) {}

  // @ts-ignore
  toString() {
    if (isNull(this.items)) return "null"
    const contents: string = this.items.map((i) => i.toString()).join(",")
    return `|[${contents}]|`
  }

  // @ts-ignore
  serialize() {
    if (isNull(this.items)) return null
    return this.items.map((i) => i.serialize())
  }

  isUnset() {
    return isNull(this.items)
  }
}
