/* @flow */

import type {$Field} from "../brim"
import type {Column} from "./"

export type FieldValue = string | null

export type FieldData = {
  name: string,
  type: string,
  value: FieldValue
}

export type RecordData = FieldData[]

export type $Record = {|
  columns: () => Column[],
  values: () => FieldValue[],
  data: () => RecordData,
  field: (string) => ?$Field
|}
