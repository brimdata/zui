import {Time} from "./time"
import {Typename} from "./typename"
import {UInt16} from "./uint16"
import {UInt64} from "./uint64"
import {String} from "./string"
import {Record} from "./record"
import {ZedType} from "../types/types"

export type ZedValue = String | Record | Time | Typename | UInt16 | UInt64

export interface ZedValueInterface {
  toString(): string
  type: ZedType
}

export interface ZedField {
  name: string
  value: ZedValue
}
