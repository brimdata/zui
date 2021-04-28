import {Duration} from "../values/duration"
import {PrimitiveType} from "../../zjson"
import {PrimitiveTypeInterface} from "./types"

class TypeOfDuration implements PrimitiveTypeInterface<Duration> {
  name = "duration"
  kind = "primitive"

  serialize(): PrimitiveType {
    return {kind: "primitive", name: this.name}
  }

  create(value: string) {
    return new Duration(value)
  }
}

export const TypeDuration = new TypeOfDuration()
