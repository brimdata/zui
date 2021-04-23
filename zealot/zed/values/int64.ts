import {TypeInt64} from "../types/type-int64"
import {ZedValueInterface} from "./types"

export class Int64 implements ZedValueInterface {
  constructor(private value: string) {}

  get type() {
    return TypeInt64
  }

  toString() {
    return this.value.toString()
  }

  serialize() {
    return this.value.toString()
  }
}
