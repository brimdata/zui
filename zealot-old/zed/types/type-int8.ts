import {Int8} from "../values/int8"
import {BasePrimitive} from "./base-primitive"

class TypeOfInt8 extends BasePrimitive<Int8> {
  name = "int8"

  create(value) {
    return new Int8(value)
  }
}

export const TypeInt8 = new TypeOfInt8()
