import {Value} from "../zjson"
import {TypeArray} from "./type-array"
import {TypeMap} from "./type-map"
import {PrimitiveTypes} from "./type-primitives"
import {TypeRecord} from "./type-record"
import {TypeSet} from "./type-set"
import {TypeUnion} from "./type-union"

export type ZedType =
  | PrimitiveTypes
  | TypeRecord
  | TypeArray
  | TypeSet
  | TypeUnion
  | TypeMap

export interface PrimitiveTypeInterface<T> {
  name: string
  kind: string
  serialize(): {name: string; kind: string}
  create(value: Value, typedefs?: object): T
}
