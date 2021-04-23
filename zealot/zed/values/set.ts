import {TypeSet} from "../types/type-set"
import {ZedValue, ZedValueInterface} from "./types"

export class Set implements ZedValueInterface {
  constructor(public type: TypeSet, public items: ZedValue[]) {}

  toString() {
    const contents = this.items.map((i) => i.toString()).join(",")
    return `|[${contents}]|`
  }

  serialize() {
    return this.items.map((i) => i.serialize())
  }
}
