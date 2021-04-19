import {ZedArray} from "./array"
import {ZedEnum} from "./enum"
import {ZedField} from "./field"
import {ZedMap} from "./map"
import {ZedPrimitive} from "./primitive"
import {ZedRecord} from "./record"
import {ZedSet} from "./set"
import {ZedUnion} from "./union"

export {
  ZedArray,
  ZedEnum,
  ZedMap,
  ZedPrimitive,
  ZedRecord,
  ZedSet,
  ZedUnion,
  ZedField
}

export type ZedData =
  | ZedPrimitive
  | ZedRecord
  | ZedArray
  | ZedSet
  | ZedUnion
  | ZedEnum
  | ZedMap
