import {TypeBString} from "./type-bstring"
import {TypeDuration} from "./type-duration"
import {TypeFloat64} from "./type-float64"
import {TypeInt64} from "./type-int64"
import {TypeIp} from "./type-ip"
import {TypeNet} from "./type-net"
import {TypeNull} from "./type-null"
import {TypeString} from "./type-string"
import {TypeTime} from "./type-time"
import {TypeTypename} from "./type-typename"
import {TypeUInt16} from "./type-uint16"
import {TypeUInt32} from "./type-uint32"
import {TypeUInt64} from "./type-uint64"

// These all point to a single instance of their type
const primitives = {
  string: TypeString,
  bstring: TypeBString,
  time: TypeTime,
  ip: TypeIp,
  uint16: TypeUInt16,
  duration: TypeDuration,
  uint64: TypeUInt64,
  uint32: TypeUInt32,
  int64: TypeInt64,
  null: TypeNull,
  typename: TypeTypename,
  net: TypeNet,
  float64: TypeFloat64
} as const

export type PrimitiveTypes = typeof primitives[keyof typeof primitives]

export default primitives
