import {TypeTypename} from "../types/type-typename"
import {Primitive} from "./primitive"
import {JSOptions} from "./types"

// I don't think I ever use this...
export class Typename extends Primitive {
  type: typeof TypeTypename = TypeTypename

  toJS(opts: JSOptions = {}) {
    return this.toString()
  }
}
