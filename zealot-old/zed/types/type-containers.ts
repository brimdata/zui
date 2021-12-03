import {TypeAlias} from "./type-alias"
import {TypeArray} from "./type-array"
import {TypeMap} from "./type-map"
import {TypeRecord} from "./type-record"
import {TypeSet} from "./type-set"
import {TypeUnion} from "./type-union"

const containers = {
  record: TypeRecord,
  array: TypeArray,
  set: TypeSet,
  union: TypeUnion,
  map: TypeMap,
  alias: TypeAlias
} as const

export default containers

export type ContainerName = keyof typeof containers
export type ContainerType = typeof containers[ContainerName]
