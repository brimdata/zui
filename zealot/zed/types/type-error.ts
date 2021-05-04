import {PrimitiveTypeInterface} from "./types"
import {Error} from "../values/error"
import {PrimitiveType} from "../../zjson"

class TypeOfError implements PrimitiveTypeInterface<Error> {
  name = "error"
  kind = "primitive"

  serialize(): PrimitiveType {
    return {kind: "primitive", name: this.name}
  }

  create(value: string) {
    return new Error(value)
  }
}

export const TypeError = new TypeOfError()
