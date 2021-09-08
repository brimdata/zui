import {isNull} from "../utils"
import {TypeMap} from "../types/type-map"
import {ZedValue, ZedValueInterface} from "./types"

export class ZedMap implements ZedValueInterface {
  constructor(
    public type: TypeMap,
    public value: Map<ZedValue, ZedValue> | null
  ) {}

  // @ts-ignore
  toString() {
    if (isNull(this.value)) return "null"
    const contents: string = Array.from(this.value.entries())
      .map(
        ([key, value]) => "{" + key.toString() + "," + value.toString() + "}"
      )
      .join(",")
    return `|{${contents}}|}`
  }

  // @ts-ignore
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
