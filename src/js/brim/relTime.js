/* @flow */

import brim from "./"

const NOW = /^\s*now\s*$/i
const AGO = /^\s*now\s*-\s*(\d+)\s*([smhdwMy])\s*$/i

type Op = null | "-"
type Unit = "s" | "m" | "h" | "d" | "w" | "M" | "y"
type Ast = {|op: Op, amount: number, unit: Unit|}

export default function relTime(expr: string, now: Date = new Date()) {
  function parse(): Ast {
    if (AGO.test(expr)) {
      let match = expr.match(AGO)
      // $FlowFixMe
      return {op: "-", amount: Number(match[1]), unit: match[2]}
    }

    if (NOW.test(expr)) {
      return {amount: 0, op: null, unit: "s"}
    }

    throw new Error("Invalid relTime expression: " + expr)
  }

  function execute(ast: Ast) {
    let time = brim.time(now)

    switch (ast.op) {
      case "-":
        return time.subtract(ast.amount, ast.unit)
      default:
        return time
    }
  }

  return {
    isValid() {
      try {
        parse()
        return true
      } catch {
        return false
      }
    },

    toTs() {
      return execute(parse()).toTs()
    },
    toAst() {
      return parse()
    }
  }
}
