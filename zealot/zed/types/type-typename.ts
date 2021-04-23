import {Typename} from "../values/typename"
import {PrimitiveTypeInterface} from "./types"

class TypeOfTypename implements PrimitiveTypeInterface<Typename> {
  name = "typename"
  kind = "primitive"

  serialize() {
    return {kind: this.kind, name: this.name}
  }

  create(value: string) {
    return new Typename(value)
  }
}

export const TypeTypename = new TypeOfTypename()
