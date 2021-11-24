import {isNull} from "../utils"
import {ZedTypeInterface} from "../types/types"
import {ZedValueInterface} from "./types"

export class Primitive implements ZedValueInterface {
  type: ZedTypeInterface

  constructor(public value: string | null = null) {}

  isUnset() {
    return isNull(this.value)
  }

  isSet() {
    return !this.isUnset()
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
