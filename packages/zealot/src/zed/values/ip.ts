import {TypeIp} from "../types/type-ip"
import {Primitive} from "./primitive"
import {JSOptions} from "./types"

export class Ip extends Primitive {
  type: typeof TypeIp = TypeIp

  toJS(opts: JSOptions = {}) {
    return this.toString()
  }
}
