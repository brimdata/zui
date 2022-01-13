import {TypeError} from "../types/type-error"
import {Primitive} from "./primitive"

export class Error extends Primitive {
  type: typeof TypeError = TypeError

  toJS() {
    return new global.Error(this.toString())
  }
}
