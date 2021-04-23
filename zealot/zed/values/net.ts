import {TypeNet} from "../types/type-net"
import {ZedValueInterface} from "./types"

export class Net implements ZedValueInterface {
  constructor(private value: string) {}

  get type() {
    return TypeNet
  }

  toString() {
    return this.value.toString()
  }

  serialize() {
    return this.value.toString()
  }
}
