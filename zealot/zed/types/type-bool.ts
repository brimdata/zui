import {Bool} from "../values/bool"
import {PrimitiveType} from "../../zjson"
import {PrimitiveTypeInterface} from "./types"

class TypeOfBool implements PrimitiveTypeInterface<Bool> {
  name = "bool"
  kind = "primitive"

  serialize(): PrimitiveType {
    return {kind: "primitive", name: this.name}
  }

  create(value: string) {
    return new Bool(value)
  }
}

export const TypeBool = new TypeOfBool()
