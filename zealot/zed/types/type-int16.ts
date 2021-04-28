import {Int16} from "../values/int16"
import {PrimitiveType} from "../../zjson"
import {PrimitiveTypeInterface} from "./types"

class TypeOfInt16 implements PrimitiveTypeInterface<Int16> {
  name = "int16"
  kind = "primitive"

  serialize(): PrimitiveType {
    return {kind: "primitive", name: this.name}
  }

  create(value) {
    return new Int16(value)
  }
}

export const TypeInt16 = new TypeOfInt16()
