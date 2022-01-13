import {TypeBool} from "./type-bool"
import {TypeBString} from "./type-bstring"
import {TypeBytes} from "./type-bytes"
import {TypeDuration} from "./type-duration"
import {TypeError} from "./type-error"
import {TypeFloat64} from "./type-float64"
import {TypeInt16} from "./type-int16"
import {TypeInt32} from "./type-int32"
import {TypeInt64} from "./type-int64"
import {TypeInt8} from "./type-int8"
import {TypeIp} from "./type-ip"
import {TypeNet} from "./type-net"
import {TypeNull} from "./type-null"
import {TypeString} from "./type-string"
import {TypeTime} from "./type-time"
import {TypeType} from "./type-type"
import {TypeTypename} from "./type-typename"
import {TypeUint16} from "./type-uint16"
import {TypeUint32} from "./type-uint32"
import {TypeUint64} from "./type-uint64"
import {TypeUint8} from "./type-uint8"

// These all point to a single instance of their type
const primitives = {
  string: TypeString as typeof TypeString,
  bstring: TypeBString as typeof TypeBString,
  time: TypeTime as typeof TypeTime,
  ip: TypeIp as typeof TypeIp,
  uint16: TypeUint16 as typeof TypeUint16,
  uint8: TypeUint8 as typeof TypeUint8,
  duration: TypeDuration as typeof TypeDuration,
  uint64: TypeUint64 as typeof TypeUint64,
  uint32: TypeUint32 as typeof TypeUint32,
  int64: TypeInt64 as typeof TypeInt64,
  int8: TypeInt8 as typeof TypeInt8,
  int16: TypeInt16 as typeof TypeInt16,
  null: TypeNull as typeof TypeNull,
  typename: TypeTypename as typeof TypeTypename,
  net: TypeNet as typeof TypeNet,
  float64: TypeFloat64 as typeof TypeFloat64,
  int32: TypeInt32 as typeof TypeInt32,
  bool: TypeBool as typeof TypeBool,
  bytes: TypeBytes as typeof TypeBytes,
  type: TypeType as typeof TypeType,
  error: TypeError as typeof TypeError
} as const

export default primitives

export type PrimitiveName = keyof typeof primitives
export type PrimitiveType = typeof primitives[PrimitiveName]
