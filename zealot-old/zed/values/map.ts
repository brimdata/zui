import {isNull} from "../utils"
import {TypeIp} from "../types/type-ip"
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
      .map(([key, value]) => {
        const sep = isIPv6(key) ? " :" : ":"
        return key.toString() + sep + value.toString()
      })
      .join(",")
    return `|{${contents}}|`
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

function isIPv6(v: ZedValue): boolean {
  return v.type === TypeIp && v.toString().includes(":")
}
