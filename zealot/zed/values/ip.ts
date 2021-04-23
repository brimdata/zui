import {TypeIp} from "../types/type-ip"
import {ZedValueInterface} from "./types"

export class Ip implements ZedValueInterface {
  constructor(private value: string) {}

  get type() {
    return TypeIp
  }

  toString() {
    return this.value.toString()
  }

  serialize() {
    return this.value.toString()
  }
}
