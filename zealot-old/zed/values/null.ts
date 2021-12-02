import {TypeNull} from "../types/type-null"
import {Primitive} from "./primitive"

export class Null extends Primitive {
  type = TypeNull
  value = null
}
