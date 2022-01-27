import {isNull} from "lodash"
import {zjson} from "../.."
import {TypeError} from "../types/type-error"
import {JSOptions, Value} from "./types"

export class Error implements Value {
  constructor(public type: TypeError, public value: Value | null) {}

  toJS(opts: JSOptions = {}) {
    return new global.Error(this.toString())
  }

  toString(): string {
    if (isNull(this.value)) return "null"
    return this.value.toString()
  }

  serialize(): zjson.Value {
    if (isNull(this.value)) {
      return null
    } else {
      return this.value!.serialize()
    }
  }

  isUnset(): boolean {
    return isNull(this.value)
  }
}
