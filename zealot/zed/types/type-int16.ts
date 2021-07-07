import {Int16} from "../values/int16"
import {BasePrimitive} from "./base-primitive"

class TypeOfInt16 extends BasePrimitive<Int16> {
  name = "int16"

  create(value) {
    return new Int16(value)
  }
}

export const TypeInt16 = new TypeOfInt16()
