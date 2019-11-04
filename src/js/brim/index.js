/* @flow */
import ast from "./ast"
import compoundField from "./compoundField"
import field from "./field"
import log from "./log"
import program from "./program"
import space from "./space"
import syntax from "./syntax"
import table from "./table"

export type $Field = {
  name: string,
  value: string,
  type: string,
  queryableValue: () => string,
  compound: () => boolean,
  toCompound: () => $CompoundField,
  toDate: () => Date,
  display: () => string,
  guessWidth: () => number
}

export type $CompoundField = {
  name: string,
  container: string,
  itemType: string,
  length: number,
  items: () => $Field[],
  item: (number) => ?$Field,
  guessWidth: () => number
}

export type $Log = {
  field: (string) => ?$Field
}

export default {
  table,
  program,
  field,
  compoundField,
  log,
  ast,
  syntax,
  space
}
