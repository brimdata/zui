import {ZedType} from "../types/types"
import {isNull} from "../utils"
import {ZedValueInterface} from "./types"

export abstract class Primitive implements ZedValueInterface {
  abstract type: ZedType

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
