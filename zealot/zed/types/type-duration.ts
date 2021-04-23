import {Duration} from "../values/duration"
import {PrimitiveTypeInterface} from "./types"

class TypeOfDuration implements PrimitiveTypeInterface<Duration> {
  name = "duration"
  kind = "primitive"

  serialize() {
    return {kind: this.kind, name: this.name}
  }

  create(value: string) {
    return new Duration(value)
  }
}

export const TypeDuration = new TypeOfDuration()
