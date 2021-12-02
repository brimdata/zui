import {Null} from "../values/null"
import {BasePrimitive} from "./base-primitive"

class TypeOfNull extends BasePrimitive<Null> {
  name = "null"

  create(_value: any) {
    return new Null()
  }
}

export const TypeNull = new TypeOfNull()
