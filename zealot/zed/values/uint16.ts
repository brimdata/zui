import {TypeUInt16} from "../types/type-uint16"
import {ZedValueInterface} from "./types"

export class UInt16 implements ZedValueInterface {
  constructor(private value: string) {}

  get type() {
    return TypeUInt16
  }

  toString() {
    return this.value.toString()
  }

  serialize() {
    return this.value.toString()
  }
}
