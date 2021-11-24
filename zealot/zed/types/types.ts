import {zjson} from "zealot"
import {Field} from ".."
import {ZedContext} from "../context"
import {ContainerType} from "./type-containers"
import {PrimitiveType} from "./type-primitives"

export type AnyTime = PrimitiveType | ContainerType

export type SerializeTypeDefs = {
  [key: string]: zjson.Type
}

export type TypeDefs = {[key: string]: ZedTypeInterface}
export interface ZedTypeInterface {
  id?: string | number
  name?: string
  toString(): string
  serialize(typedefs: any /* SerializeTypeDefs */): any // FIX zjson.Type
  create(value: zjson.Value, typedefs: any /* TypeDefs */, parent?: Field): any // FIX ZedValueInterface
}

export interface ContainerTypeInterface extends ZedTypeInterface {
  hasTypeType(ctx: ZedContext): boolean
  walkTypeValues(
    context: ZedContext,
    value: zjson.Value,
    visit: (name: string) => void
  ): void
}
