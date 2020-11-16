import ast from "./ast"
import dateTuple from "./dateTuple"
import entries from "./entries"
import form from "./form"
import interop from "./interop"
import program from "./program"
import randomHash from "./randomHash"
import relTime from "./relTime"
import space from "./space"
import span from "./span"
import syntax from "./syntax"
import tab from "./brimTab"

import time from "./time"
import zeekLogInfo from "./zeekLogInfo"
import connection from "./connection"

export type Ts = {
  ns: number
  sec: number
}

export type BrimSpace = ReturnType<typeof space>
export type BrimConnection = ReturnType<typeof connection>

export type Span = [Ts, Ts]

export default {
  program,
  ast,
  syntax,
  space,
  time,
  relTime,
  span,
  dateTuple,
  form,
  interop,
  randomHash,
  entries,
  tab,
  zeekLogInfo,
  connection
}
