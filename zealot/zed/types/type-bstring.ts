import {BString} from "../values/bstring"
import {PrimitiveType} from "../../zjson"
import {PrimitiveTypeInterface} from "./types"

class TypeOfBString implements PrimitiveTypeInterface<BString> {
  name = "bstring"
  kind = "primitive"

  serialize(): PrimitiveType {
    return {kind: "primitive", name: this.name}
  }

  create(value: string) {
    return new BString(value)
  }
}

export const TypeBString = new TypeOfBString()
