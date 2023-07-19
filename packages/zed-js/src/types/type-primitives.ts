import { TypeBool } from './type-bool';
import { TypeBString } from './type-bstring';
import { TypeBytes } from './type-bytes';
import { TypeDuration } from './type-duration';
import { TypeFloat16 } from './type-float16';
import { TypeFloat32 } from './type-float32';
import { TypeFloat64 } from './type-float64';
import { TypeInt16 } from './type-int16';
import { TypeInt32 } from './type-int32';
import { TypeInt64 } from './type-int64';
import { TypeInt8 } from './type-int8';
import { TypeIp } from './type-ip';
import { TypeNet } from './type-net';
import { TypeNull } from './type-null';
import { TypeString } from './type-string';
import { TypeTime } from './type-time';
import { TypeType } from './type-type';
import { TypeTypename } from './type-typename';
import { TypeUint16 } from './type-uint16';
import { TypeUint32 } from './type-uint32';
import { TypeUint64 } from './type-uint64';
import { TypeUint8 } from './type-uint8';

// These all point to a single instance of their type
export const getPrimitives = () => {
  return {
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
    float32: TypeFloat32 as typeof TypeFloat32,
    float16: TypeFloat16 as typeof TypeFloat16,
    int32: TypeInt32 as typeof TypeInt32,
    bool: TypeBool as typeof TypeBool,
    bytes: TypeBytes as typeof TypeBytes,
    type: TypeType as typeof TypeType,
  };
};

export function isPrimitiveType(value: unknown): value is PrimitiveType {
  return (
    value === TypeString ||
    value === TypeBString ||
    value === TypeTime ||
    value === TypeIp ||
    value === TypeUint16 ||
    value === TypeUint8 ||
    value === TypeDuration ||
    value === TypeUint64 ||
    value === TypeUint32 ||
    value === TypeInt64 ||
    value === TypeInt8 ||
    value === TypeInt16 ||
    value === TypeNull ||
    value === TypeTypename ||
    value === TypeNet ||
    value === TypeFloat64 ||
    value === TypeFloat32 ||
    value === TypeFloat16 ||
    value === TypeInt32 ||
    value === TypeBool ||
    value === TypeBytes ||
    value === TypeType
  );
}

export type PrimitiveName = keyof ReturnType<typeof getPrimitives>;
export type PrimitiveType = ReturnType<typeof getPrimitives>[PrimitiveName];
