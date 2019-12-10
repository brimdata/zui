/* @flow */
import ast from "./ast"
import compoundField from "./compoundField"
import dateTuple from "./dateTuple"
import field from "./field"
import interop from "./interop"
import log from "./log"
import program from "./program"
import record from "./record"
import recordsBuffer from "./recordsBuffer"
import relTime from "./relTime"
import space from "./space"
import span from "./span"
import syntax from "./syntax"
import table from "./table"
import time from "./time"

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

export type Ts = {
  ns: number,
  sec: number
}

export type Span = [Ts, Ts]

export default {
  table,
  program,
  field,
  compoundField,
  log,
  ast,
  syntax,
  space,
  time,
  relTime,
  span,
  dateTuple,
  recordsBuffer,
  record,
  interop
}
