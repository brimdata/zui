import {Null} from "../values/null"
import {PrimitiveTypeInterface} from "./types"

class TypeOfNull implements PrimitiveTypeInterface<Null> {
  name = "null"
  kind = "primitive"

  serialize() {
    return {kind: this.kind, name: this.name}
  }

  create() {
    return null
  }
}

export const TypeNull = new TypeOfNull()
