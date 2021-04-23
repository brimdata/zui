import {TypeUInt64} from "../types/type-uint64"
import {ZedValueInterface} from "./types"

export class UInt64 implements ZedValueInterface {
  constructor(private value: string) {}

  get type() {
    return TypeUInt64
  }

  toString() {
    return this.value.toString()
  }

  serialize() {
    return this.value.toString()
  }
}
