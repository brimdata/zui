/* @flow */

import {first} from "./Array"
import {getProcNames} from "./ast"
import {parse} from "./Program"

describe("#getProcNames", () => {
  function run(program) {
    return getProcNames(first(parse(program)))
  }

  test("nested procs", () => {
    const program = "* | (cut uid; cut uid, ts) | tail 1"
    expect(run(program)).toEqual([
      "SequentialProc",
      "ParallelProc",
      "CutProc",
      "CutProc",
      "TailProc"
    ])
  })
})
