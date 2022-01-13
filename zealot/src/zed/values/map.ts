import {TypeIp} from "../types/type-ip"
import {TypeMap} from "../types/type-map"
import {isNull} from "../utils"
import {Value} from "./types"

export class ZedMap implements Value {
  constructor(public type: TypeMap, public value: Map<Value, Value> | null) {}

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

  toJS() {
    if (isNull(this.value)) return null
    return new Map(
      Array.from(this.value.entries()).map(([k, v]) => [k.toJS(), v.toJS()])
    )
  }
}

function isIPv6(v: Value): boolean {
  return v.type === TypeIp && v.toString().includes(":")
}
