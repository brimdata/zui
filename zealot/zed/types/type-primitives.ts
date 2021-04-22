import {TypeBstring} from "./type-bstring"
import {TypeDuration} from "./type-duration"
import {TypeIp} from "./type-ip"
import {TypeNull} from "./type-null"
import {TypeString} from "./type-string"
import {TypeTime} from "./type-time"
import {TypeUint16} from "./type-uint16"
import {TypeUint64} from "./type-uint64"

// These all point to a single instance of their type
export default {
  string: TypeString,
  bstring: TypeBstring,
  time: TypeTime,
  ip: TypeIp,
  uint16: TypeUint16,
  duration: TypeDuration,
  uint64: TypeUint64,
  null: TypeNull
}
