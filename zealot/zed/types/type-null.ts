import {Null} from "../values/null"
import {PrimitiveType} from "../../zjson"
import {PrimitiveTypeInterface} from "./types"

class TypeOfNull implements PrimitiveTypeInterface<Null> {
  name = "null"
  kind = "primitive"

  serialize(): PrimitiveType {
    return {kind: "primitive", name: this.name}
  }

  create() {
    return new Null()
  }
}

export const TypeNull = new TypeOfNull()
