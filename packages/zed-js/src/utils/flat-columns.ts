import { TypeRecord } from '../types/type-record';
import { Type } from '../types/types';
import { trueType } from './true-type';

export function flatColumns(
  type: Type,
  columns: (string | string[])[] = [],
  path: string[] | undefined = undefined
) {
  const record = trueType(type);
  if (!(record instanceof TypeRecord)) return columns;

  if (record.fields === null) return [];
  for (const f of record.fields) {
    const type = trueType(f.type);
    if (type instanceof TypeRecord) {
      flatColumns(type, columns, !path ? [f.name] : [...path, f.name]);
    } else {
      columns.push(path ? [...path, f.name] : f.name);
    }
  }
  return columns;
}
