import {isNull} from "lodash"
import {TypeMap} from "../types/type-map"
import {ZedValue, ZedValueInterface} from "./types"

export class ZedMap implements ZedValueInterface {
  constructor(
    public type: TypeMap,
    public value: Map<ZedValue, ZedValue> | null
  ) {}

  toString() {
    if (isNull(this.value)) return "null"
    const contents = Array.from(this.value.entries())
      .map(
        ([key, value]) => "{" + key.toString() + "," + value.toString() + "}"
      )
      .join(",")
    return `|{${contents}}|}`
  }

  serialize() {
    if (isNull(this.value)) return null
    return Array.from(this.value.entries()).map(([k, v]) => {
      return [k.serialize(), v.serialize()]
    })
  }

  isUnset() {
    return isNull(this.value)
  }
}
