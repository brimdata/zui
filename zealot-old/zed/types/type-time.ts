import {Time} from "../values/time"
import {BasePrimitive} from "./base-primitive"

class TypeOfTime extends BasePrimitive<Time> {
  name = "time"

  create(value: string) {
    return new Time(value)
  }
}

export const TypeTime = new TypeOfTime()
