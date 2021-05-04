import {ZedContext} from "../context"
import {ZedValue} from "../values/types"
import {PrimitiveType, Type, Value} from "../../zjson"
import {TypeAlias} from "./type-alias"
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
  | TypeAlias

export interface PrimitiveTypeInterface<T> {
  name: string
  kind: string
  serialize(): PrimitiveType
  create(value: Value, typedefs?: object): T
  toString(): string
}

export interface ContainerTypeInterface {
  serialize(typedefs: object): Type
  toString(): string
  create(value: Value, typedefs?: object): ZedValue
  hasTypeType(ctx: ZedContext): boolean
  walkTypeValues(
    context: ZedContext,
    value: Value,
    visit: (name: string) => void
  )
}
