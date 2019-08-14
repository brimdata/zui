/* @flow */
import field from "./field"
import log from "./log"
import program from "./program"
import table from "./table"

export type $Field = {
  name: string,
  value: string,
  type: string,
  queryableValue: () => string
}

export type $Log = {
  field: (string) => ?$Field
}

export default {
  table,
  program,
  field,
  log
}
