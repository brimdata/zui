/* @flow */

import {parse, getGroupByProc} from "./Program"
import {trim} from "./Str"
import Log from "../models/Log"

export default (program: string, result: Log) => {
  const [ast] = parse(program)
  const groupByProc = getGroupByProc(ast)

  if (!groupByProc) return null

  const filters = groupByProc.keys.map(key => `${key}=${result.get(key)}`)
  let filter = program.split("|")[0]

  if (/\s*\*\s*/.test(filter)) filter = ""

  return trim([filter, ...filters].map(trim).join(" "))
}
