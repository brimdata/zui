import { TypeAlias } from './type-alias';
import { TypeArray } from './type-array';
import { TypeMap } from './type-map';
import { TypeRecord } from './type-record';
import { TypeSet } from './type-set';
import { TypeUnion } from './type-union';
import { TypeError } from './type-error';

const containers = {
  record: TypeRecord,
  array: TypeArray,
  set: TypeSet,
  union: TypeUnion,
  map: TypeMap,
  alias: TypeAlias,
  error: TypeError,
} as const;

export function isContainerType(value: unknown): value is ContainerType {
  return (
    value instanceof TypeAlias ||
    value instanceof TypeArray ||
    value instanceof TypeMap ||
    value instanceof TypeRecord ||
    value instanceof TypeSet ||
    value instanceof TypeUnion ||
    value instanceof TypeError
  );
}

export default containers;

export type ContainerName = keyof typeof containers;
export type ContainerType = (typeof containers)[ContainerName];
