import {TypeArray} from "../types/type-array"
import {isNull} from "../utils"
import {ZedValueInterface} from "./types"

export class Array implements ZedValueInterface {
  constructor(
    public type: TypeArray,
    public items: ZedValueInterface[] | null
  ) {}

  indexOf(value: ZedValueInterface) {
    if (isNull(this.items)) return -1
    return this.items.indexOf(value)
  }

  at(index: number) {
    if (isNull(this.items)) return undefined
    return this.items[index]
  }

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
