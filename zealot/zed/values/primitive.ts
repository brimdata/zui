import {isNull} from "lodash"
import {ZedType} from "../types/types"
import {ZedValueInterface} from "./types"

export class Primitive implements ZedValueInterface {
  type: ZedType

  constructor(public value: string | null = null) {}

  isUnset() {
    return isNull(this.value)
  }

  toString() {
    if (isNull(this.value)) return "null"
    return this.value.toString()
  }

  serialize() {
    if (isNull(this.value)) return null
    return this.value.toString()
  }
}
