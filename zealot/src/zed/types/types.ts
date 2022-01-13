import {Field} from "../index"
import * as zjson from "../../zjson"
import {TypeDefs, ZedContext} from "../context"
import {Value} from "../values/types"
import {TypeAlias} from "./type-alias"
import {TypeArray} from "./type-array"
import {TypeMap} from "./type-map"
import {PrimitiveType} from "./type-primitives"
import {TypeRecord} from "./type-record"
import {TypeSet} from "./type-set"
import {TypeUnion} from "./type-union"

export type ZedType =
  | PrimitiveType
  | TypeRecord
  | TypeArray
  | TypeSet
  | TypeUnion
  | TypeMap
  | TypeAlias

export type SerializeTypeDefs = {
  [key: string]: zjson.Type
}

export interface Type {
  id?: string | number
  name?: string
  toString(): string
  serialize(typedefs: SerializeTypeDefs): zjson.Type
  create(value: zjson.Value, typedefs: TypeDefs, parent?: Field): Value
}

export interface ContainerType extends Type {
  hasTypeType(ctx: ZedContext): boolean
  walkTypeValues(
    context: ZedContext,
    value: zjson.Value,
    visit: (name: string) => void
  ): void
}
