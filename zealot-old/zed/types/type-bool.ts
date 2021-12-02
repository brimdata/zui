import {Bool} from "../values/bool"
import {BasePrimitive} from "./base-primitive"

class TypeOfBool extends BasePrimitive<Bool> {
  name = "bool"

  create(value: string) {
    return new Bool(value)
  }
}

export const TypeBool = new TypeOfBool()
