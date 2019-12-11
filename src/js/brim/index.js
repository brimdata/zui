/* @flow */
import type {ExtractReturn} from "../types"
import ast from "./ast"
import compoundField from "./compoundField"
import dateTuple from "./dateTuple"
import field from "./field"
import flatRecordsBuffer from "./flatRecordsBuffer"
import interop from "./interop"
import log from "./log"
import program from "./program"
import randomHash from "./randomHash"
import record from "./record"
import relTime from "./relTime"
import search from "./search"
import space from "./space"
import span from "./span"
import syntax from "./syntax"
import table from "./table"
import time from "./time"

export type $Field = {
  name: string,
  type: string,
  value: string,
  queryableValue: () => string,
  compound: () => boolean,
  toCompound: () => $CompoundField,
  toDate: () => Date,
  display: () => string,
  guessWidth: () => number
}

export type $CompoundField = ExtractReturn<typeof compoundField>
export type $Search = ExtractReturn<typeof search>
export type $Log = ExtractReturn<typeof log>

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
  flatRecordsBuffer,
  record,
  interop,
  search,
  randomHash
}
