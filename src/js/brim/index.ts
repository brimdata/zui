import ast from "./ast"
import dateTuple from "./dateTuple"
import form from "./form"
import program from "./program"
import randomHash from "./randomHash"
import relTime from "./relTime"
import span from "./span"
import syntax from "./syntax"
import tab from "./brimTab"
import time from "./time"
import lake from "./lake"

export type Ts = {
  ns: number
  sec: number
}

export type BrimLake = ReturnType<typeof lake>

export type Span = [Ts, Ts]

// Please remove all this one day
export default {
  program,
  ast,
  syntax,
  time,
  relTime,
  span,
  dateTuple,
  form,
  randomHash,
  tab,
  lake,
}
