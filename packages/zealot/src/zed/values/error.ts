import {isNull} from "lodash"
import * as zjson from "../../zjson"
import {EncodeStream} from "../encode-stream"
import {TypeError} from "../types/type-error"
import {Value} from "./types"

export class Error implements Value {
  constructor(public type: TypeError, public value: Value | null) {}

  toJS() {
    return new global.Error(this.toString())
  }

  toString(): string {
    if (isNull(this.value)) return "null"
    return `Error(${this.value.toString()})`
  }

  serialize(stream: EncodeStream): zjson.Value {
    if (isNull(this.value)) {
      return null
    } else {
      return stream.encodeValue(this.value!)
    }
  }

  isUnset(): boolean {
    return isNull(this.value)
  }
}
