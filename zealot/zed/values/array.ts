import {TypeArray} from "../types/type-array"
import {ZedValue, ZedValueInterface} from "./types"

export class ZedArray implements ZedValueInterface {
  constructor(public type: TypeArray, public items: ZedValue[]) {}

  toString() {
    const contents = this.items.map((i) => i.toString()).join(",")
    return `[${contents}]`
  }

  serialize() {
    return this.items.map((i) => i.serialize())
  }
}
