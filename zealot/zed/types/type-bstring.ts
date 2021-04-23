import {BString} from "../values/bstring"
import {PrimitiveTypeInterface} from "./types"

class TypeOfBString implements PrimitiveTypeInterface<BString> {
  name = "bstring"
  kind = "primitive"

  serialize() {
    return {kind: this.kind, name: this.name}
  }

  create(value: string) {
    return new BString(value)
  }
}

export const TypeBString = new TypeOfBString()
