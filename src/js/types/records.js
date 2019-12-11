/* @flow */

import type {$Field} from "../brim"
import type {Column} from "./"

export type FieldValue = string

export type FieldData = {
  name: string,
  type: string,
  value: string
}

export type RecordData = FieldData[]

export type $Record = {|
  columns: () => Column[],
  values: () => string[],
  data: () => RecordData,
  field: (string) => ?$Field
|}
