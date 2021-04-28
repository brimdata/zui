import {Typename} from "../values/typename"
import {PrimitiveType} from "../../zjson"
import {PrimitiveTypeInterface} from "./types"

class TypeOfTypename implements PrimitiveTypeInterface<Typename> {
  name = "typename"
  kind = "primitive"

  serialize(): PrimitiveType {
    return {kind: "primitive", name: this.name}
  }

  create(value: string) {
    return new Typename(value)
  }
}

export const TypeTypename = new TypeOfTypename()
