import {TypeNet} from "../types/type-net"
import {Primitive} from "./primitive"
import {JSOptions} from "./types"

export class Net extends Primitive {
  type: typeof TypeNet = TypeNet

  toJS() {
    return this.toString()
  }
}
