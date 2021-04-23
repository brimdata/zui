import {Time} from "../values/time"
import {PrimitiveTypeInterface} from "./types"

class TypeOfTime implements PrimitiveTypeInterface<Time> {
  name = "time"
  kind = "primitive"

  serialize() {
    return {kind: this.kind, name: this.name}
  }

  create(value: string) {
    return new Time(value)
  }
}

export const TypeTime = new TypeOfTime()
