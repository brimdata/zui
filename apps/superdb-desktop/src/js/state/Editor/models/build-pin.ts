import {QueryPin, QueryPinInterface} from "../types"
import FromPin from "./from-pin"
import GenericPin from "./generic-pin"
import TimeRangePin from "./time-range-pin"

export default function buildPin(pin: QueryPin): QueryPinInterface {
  switch (pin.type) {
    case "generic":
      return new GenericPin(pin)
    case "from":
      return new FromPin(pin)
    case "time-range":
      return new TimeRangePin(pin)
  }
}
