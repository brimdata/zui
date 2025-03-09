import { Record } from '../values/record';
import { Array } from '../values/array';
import { ZedMap } from '../values/map';
import { Set } from '../values/set';
import { Union } from '../values/union';
import { Error } from '../values/error';
import { TypeValue } from '../values/type-value';

const containers = [Record, Array, Set, Union, ZedMap, Error, TypeValue];

export function isContainer(value: unknown) {
  for (const name of containers) {
    if (value instanceof name) return true;
  }
  return false;
}
