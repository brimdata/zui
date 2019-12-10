/* @flow */

import type {Column} from "./"

export type FieldValue = string | null
export type FieldData = {name: string, type: string, value: string}
export type RecordData = FieldData[]

export type $Record = {
  columns: () => Column[],
  values: () => string[]
}
