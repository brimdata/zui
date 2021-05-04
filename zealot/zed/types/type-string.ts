import {PrimitiveTypeInterface} from "./types"
import {String} from "../values/string"
import {PrimitiveType} from "../../zjson"
class TypeOfString implements PrimitiveTypeInterface<String> {
  name = "string"
  kind = "primitive"

  serialize(): PrimitiveType {
    return {kind: "primitive", name: this.name}
  }
  create(value: string) {
    return new String(value)
  }
}

export const TypeString = new TypeOfString()
