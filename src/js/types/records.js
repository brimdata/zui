/* @flow */

import type {$Field} from "../brim"
import type {Column} from "./"

export type FieldValue = string | null
export type FieldData = {name: string, type: string, value: string}
export type RecordData = FieldData[]

export type NestedFieldData = {
  name: string,
  type: string,
  value: FieldValue | NestedFieldData[]
}
export type NestedRecordData = NestedFieldData[]

export type $Record = {|
  columns: () => Column[],
  values: () => string[],
  data: () => RecordData,
  field: (string) => ?$Field
|}
