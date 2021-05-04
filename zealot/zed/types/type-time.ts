import {Time} from "../values/time"
import {PrimitiveType} from "../../zjson"
import {PrimitiveTypeInterface} from "./types"

class TypeOfTime implements PrimitiveTypeInterface<Time> {
  name = "time"
  kind = "primitive"

  serialize(): PrimitiveType {
    return {kind: "primitive", name: this.name}
  }

  create(value: string) {
    return new Time(value)
  }
}

export const TypeTime = new TypeOfTime()
