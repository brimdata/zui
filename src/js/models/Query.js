import Ast from "./Ast"

export default class Query {
  constructor({filter = "", space, timeWindow, procs = []}) {
    this.string = /^\s*$/.test(filter) ? "*" : filter
    ;(this.space = space), (this.timeWindow = timeWindow)
    this.procs = procs
  }

  isValid() {
    return !!this.getAst()
  }

  getFilterString() {
    return this.string ? this.string : "*"
  }

  toString() {
    return this.getFilterString() + " | " + this.procs.join("; ")
  }

  getAst() {
    if (this.hasAnalytics()) return new Ast(this.string).toJSON()
    else return new Ast(this.toString()).toJSON()
  }

  hasAnalytics() {
    return hasAnalytics(this.string)
  }
}

export const isBlank = string => /^\s*$/.test(string)

export const isValidQuery = string => !!new Ast(string).toJSON()

export const hasAnalytics = string => {
    const ast = new Ast(string).toJSON()
    if (!ast) return false
    if (ast.proc) return true
}
