import ast from "./ast"
import dateTuple from "./dateTuple"
import form from "./form"
import program from "./program"
import randomHash from "./randomHash"
import relTime from "./relTime"
import pool from "./pool"
import span from "./span"
import syntax from "./syntax"
import tab from "./brimTab"
import time from "./time"
import workspace from "./workspace"

export type Ts = {
  ns: number
  sec: number
}

export type BrimPool = ReturnType<typeof pool>
export type BrimWorkspace = ReturnType<typeof workspace>

export type Span = [Ts, Ts]

// Please remove all this one day
export default {
  program,
  ast,
  syntax,
  pool,
  time,
  relTime,
  span,
  dateTuple,
  form,
  randomHash,
  tab,
  workspace
}
