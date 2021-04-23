import {TypeMap} from "../types/type-map"
import {ZedValue, ZedValueInterface} from "./types"

export class ZedMap implements ZedValueInterface {
  constructor(public type: TypeMap, public value: Map<ZedValue, ZedValue>) {}

  toString() {
    const contents = Array.from(this.value.entries())
      .map(
        ([key, value]) => "{" + key.toString() + "," + value.toString() + "}"
      )
      .join(",")
    return `|{${contents}}|}`
  }

  serialize() {
    return Array.from(this.value.entries()).map(([k, v]) => [
      k.serialize(),
      v.serialize()
    ])
  }
}
