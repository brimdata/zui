
import { FieldValue } from "../types/records";
import { ReturnType } from "../types";
import ast from "./ast";
import compoundField from "./compoundField";
import dateTuple from "./dateTuple";
import entries from "./entries";
import field from "./field";
import flatRecordsBuffer from "./flatRecordsBuffer";
import form from "./form";
import interop from "./interop";
import log from "./log";
import program from "./program";
import randomHash from "./randomHash";
import record from "./record";
import relTime from "./relTime";
import space from "./space";
import span from "./span";
import syntax from "./syntax";
import tab from "./brimTab";
import table from "./table";
import time from "./time";
import zeekLogInfo from "./zeekLogInfo";

export type $Field = {
  name: string;
  type: string;
  value: FieldValue;
  stringValue: () => string;
  queryableValue: () => string;
  compound: () => boolean;
  toCompound: () => $CompoundField;
  toDate: () => Date;
  display: () => string;
  guessWidth: () => number;
};

export type $CompoundField = ReturnType<typeof compoundField>;
export type $Log = ReturnType<typeof log>;

export type Ts = {
  ns: number;
  sec: number;
};

export type Span = [Ts, Ts];

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
  form,
  record,
  interop,
  randomHash,
  entries,
  tab,
  zeekLogInfo
};