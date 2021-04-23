import {TypeUInt32} from "../types/type-uint32"
import {ZedValueInterface} from "./types"

export class UInt32 implements ZedValueInterface {
  constructor(private value: string) {}

  get type() {
    return TypeUInt32
  }

  toString() {
    return this.value.toString()
  }

  serialize() {
    return this.value.toString()
  }
}
