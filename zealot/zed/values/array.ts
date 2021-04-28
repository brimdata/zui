import {isNull} from "lodash"
import {TypeArray} from "../types/type-array"
import {ZedValue, ZedValueInterface} from "./types"

export class Array implements ZedValueInterface {
  constructor(public type: TypeArray, public items: ZedValue[] | null) {}

  toString() {
    if (isNull(this.items)) return "null"
    const contents = this.items.map((i) => i.toString()).join(",")
    return `[${contents}]`
  }

  serialize() {
    if (isNull(this.items)) return null
    return this.items.map((i) => i.serialize())
  }

  isUnset() {
    return isNull(this.items)
  }
}
