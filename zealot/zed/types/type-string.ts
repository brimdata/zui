import {PrimitiveTypeInterface} from "./types"
import {String} from "../values/string"
class TypeOfString implements PrimitiveTypeInterface<String> {
  name = "string"
  kind = "primitive"

  serialize() {
    return {kind: this.kind, name: this.name}
  }

  create(value: string) {
    return new String(value)
  }
}

export const TypeString = new TypeOfString()
