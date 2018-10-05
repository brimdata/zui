/* @flow */

import Ast from "../models/Ast"
import {LookyTalk} from "boom-js-client"

type Program = string

export const hasAnalytics = (string: Program) => {
  const ast = new Ast(string).toJSON()
  if (!ast) return false
  if (ast.proc) return true
  else return false
}

export const parse = (string: Program) => {
  console.log(string)
  let error = null
  let ast = null
  try {
    ast = LookyTalk.parse(string)
  } catch (e) {
    error = e
  }
  return [ast, error]
}
