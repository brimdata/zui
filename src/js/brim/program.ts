import {parseAst, zed} from "@brimdata/zealot"
import {isEmpty, last} from "lodash"
import {trim} from "../lib/Str"
import ast, {ANALYTIC_PROCS} from "./ast"
import syntax from "./syntax"

export default function (p = "") {
  return {
    exclude(field: zed.Field) {
      p = appendWithPipe(p, syntax.exclude(field))
      return this
    },

    include(field: zed.Field) {
      p = appendWithPipe(p, syntax.include(field))
      return this
    },

    in(field: zed.Field, value: zed.Value) {
      p = appendWithPipe(p, syntax.in(field, value))
      return this
    },

    notIn(field: zed.Field, value: zed.Value) {
      p = appendWithPipe(p, syntax.notIn(field, value))
      return this
    },

    cut(...fields: string[]) {
      p = appendWithPipe(p, "cut " + fields.join(", "))
      return this
    },

    quietCut(...fields: string[]) {
      return this.cut(fields.map((fieldName) => "quiet(" + fieldName + ")"))
    },

    drillDown(log: zed.Record) {
      let filter = this.filter()

      const newFilters = this.ast()
        .groupByKeys()
        .map((name) => log.tryField(name))
        .filter((f) => !!f)
        .map(syntax.include)
        .join(" ")

      if (/^\s*\*\s*$/.test(filter)) filter = ""
      if (newFilters.includes(filter)) filter = ""

      p = appendWithPipe(filter, newFilters)
      return this
    },

    countBy(field: zed.Field) {
      p = appendWithPipe(p, syntax.countBy(field))
      return this
    },

    sortBy(name: string | string[], direction: "asc" | "desc" = "asc") {
      p = p.replace(/\|\s*sort[^|]*$/i, "")
      p = appendWithPipe(p, syntax.sortBy(name, direction))
      return this
    },

    ast() {
      let tree
      try {
        tree = parseAst(p)
      } catch (error) {
        tree = {error}
      }
      return ast(tree)
    },

    filter() {
      const [head, ...tail] = p.split(
        /\|?\s*(summarize|count|countdistinct|sum)/i
      )

      if (isEmpty(tail) && this.hasAnalytics()) {
        return "*"
      } else {
        if (isEmpty(trim(head))) return "*"
        return trim(head)
      }
    },

    procs() {
      const [_, ...procs] = p.split("|")
      return procs.join("|")
    },

    string() {
      return p.trim() === "" ? "*" : p
    },

    hasAnalytics() {
      for (const proc of this.ast().getProcs()) {
        if (ANALYTIC_PROCS.includes(proc.kind)) return true
      }
      return false
    },
  }
}

function appendWithPipe(program, filter) {
  if (isEmpty(program)) return filter
  if (!isWhitespace(last(program))) program += " "
  return program + "| " + filter
}

function isWhitespace(s: string) {
  return /\s/.test(s)
}

export function concatPins(program: string, pins: string[]) {
  return [...pins, program].map((s) => trim(s)).join(" ")
}
